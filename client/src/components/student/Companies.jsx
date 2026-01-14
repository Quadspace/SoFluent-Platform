import React from 'react'
import { assets } from '../../assets/assets'
import { motion } from 'framer-motion'

const Companies = () => {
  const companies = [
    { logo: assets.microsoft_logo, name: 'Microsoft' },
    { logo: assets.walmart_logo, name: 'Walmart' },
    { logo: assets.accenture_logo, name: 'Accenture' },
    { logo: assets.adobe_logo, name: 'Adobe' },
    { logo: assets.paypal_logo, name: 'PayPal' },
  ]

  return (
    <section className="py-24 bg-[#0A0A0A] border-y border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className='text-center text-base text-gray-500 mb-16 font-bold uppercase tracking-wider'
        >
          Trusted by learners from
        </motion.p>
        <div className='flex flex-wrap items-center justify-center gap-16'>
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
            >
              <img 
                src={company.logo} 
                alt={`${company.name} logo`} 
                className='w-32 h-auto object-contain'
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Companies
