/**
 * Create Post Modal Component
 * Feature 3: Social Learning Feed™
 */

import React, { useState, useRef, useContext } from 'react';
import { X, Mic, Image, Video, Type, Send } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../common/MicroAnimations';

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const { t } = useTranslation();
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUserSafe();
  const [postType, setPostType] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setFile(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      // Error starting recording - user may need to grant microphone permission
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (postType === 'text' && !text.trim()) {
      return;
    }
    if ((postType === 'voice' || postType === 'photo' || postType === 'video') && !file) {
      return;
    }

    setUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('type', postType);
      
      if (postType === 'text') {
        formData.append('text', text);
      } else if (file) {
        formData.append('file', file);
      }

      const response = await fetch(`${backendUrl}/api/social/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        onPostCreated();
        onClose();
      }
    } catch (error) {
      // Error creating post - user will see error state
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-2xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{t('social.createPost')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Post Type Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPostType('text')}
            className={`flex-1 p-3 rounded-xl border-2 transition-all ${
              postType === 'text'
                ? 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] border-[#E91E63]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <Type className="w-5 h-5 text-white mx-auto mb-1" />
            <span className="text-white text-sm font-semibold">{t('social.text')}</span>
          </button>
          <button
            onClick={() => setPostType('voice')}
            className={`flex-1 p-3 rounded-xl border-2 transition-all ${
              postType === 'voice'
                ? 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] border-[#E91E63]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <Mic className="w-5 h-5 text-white mx-auto mb-1" />
            <span className="text-white text-sm font-semibold">{t('social.voice')}</span>
          </button>
          <button
            onClick={() => setPostType('photo')}
            className={`flex-1 p-3 rounded-xl border-2 transition-all ${
              postType === 'photo'
                ? 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] border-[#E91E63]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <Image className="w-5 h-5 text-white mx-auto mb-1" />
            <span className="text-white text-sm font-semibold">{t('social.photo')}</span>
          </button>
          <button
            onClick={() => setPostType('video')}
            className={`flex-1 p-3 rounded-xl border-2 transition-all ${
              postType === 'video'
                ? 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] border-[#E91E63]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <Video className="w-5 h-5 text-white mx-auto mb-1" />
            <span className="text-white text-sm font-semibold">{t('social.video')}</span>
          </button>
        </div>

        {/* Content Input */}
        {postType === 'text' && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('social.shareYourEnglish')}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-[#E91E63] mb-4"
            rows={5}
          />
        )}

        {postType === 'voice' && (
          <div className="mb-4">
            {!recording && !file ? (
              <button
                onClick={startRecording}
                className="w-full p-8 bg-gradient-to-r from-[#E91E63] to-[#C2185B] rounded-xl text-white font-bold flex items-center justify-center gap-3"
              >
                <Mic className="w-6 h-6" />
                {t('social.startRecording')}
              </button>
            ) : recording ? (
              <div className="text-center">
                <button
                  onClick={stopRecording}
                  className="w-full p-8 bg-red-600 rounded-xl text-white font-bold"
                >
                  ⏹ {t('social.stopRecording')}
                </button>
                <p className="text-gray-400 mt-2">{t('social.recording')}</p>
              </div>
            ) : (
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-white mb-2">{t('social.audioReady')}</p>
                <button
                  onClick={() => setFile(null)}
                  className="text-[#E91E63] text-sm"
                >
                  {t('social.recordAgain')}
                </button>
              </div>
            )}
          </div>
        )}

        {(postType === 'photo' || postType === 'video') && (
          <div className="mb-4">
            <input
              type="file"
              accept={postType === 'photo' ? 'image/*' : 'video/*'}
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="block w-full p-8 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-[#E91E63] transition-colors"
            >
              {file ? (
                <div>
                  <p className="text-white">{file.name}</p>
                  <button
                    onClick={() => setFile(null)}
                    className="text-[#E91E63] text-sm mt-2"
                  >
                    {t('social.changeFile')}
                  </button>
                </div>
              ) : (
                <div>
                  {postType === 'photo' ? (
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  ) : (
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  )}
                  <p className="text-gray-400">{t('social.selectFile')}</p>
                </div>
              )}
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={uploading || (postType === 'text' && !text.trim()) || ((postType !== 'text') && !file)}
          className="w-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <LoadingSpinner size="sm" color="white" />
              {t('social.posting')}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {t('social.post')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePostModal;
