import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { data, useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Signature from "../../components/Signature";
import StandardPage from "../../utils/pageConsistency";
import BrandText from "../../components/common/BrandText";
import SkeletonLoader from "../../components/common/SkeletonLoader";

const CoursesList = () => {
	const { navigate, allCourses } = useContext(AppContext);
	const { input } = useParams();
	const [filteredCourse, setFilteredcourse] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice()

      input ? 
        setFilteredcourse(
          tempCourses.filter(
            item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
        )
      : setFilteredcourse(tempCourses);
    }
		setLoading(false);
	}, [allCourses, input]);
	return (
		<StandardPage
			loading={loading}
			seoTitle="Course List - So Fluent"
			seoDescription="Browse all English courses available on So Fluent"
			background="bg-white"
		>
			<div className="relative md:px-36 px-8 pt-32 pb-20 text-left">
				<div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full mb-12">
					<div>
						<BrandText as="h1" variant="display" size="4xl" color="primary" weight="semibold" className="mb-4">
							Course List
						</BrandText>
						<BrandText size="base" color="secondary">
							<span
								onClick={() => navigate("/")}
								className="text-sofluent-cherry cursor-pointer hover:underline"
							>
								Home{" "}
							</span>{" "}
							/ <span>Course List</span>
						</BrandText>
					</div>
					<SearchBar data={input} />
				</div>

				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<SkeletonLoader key={i} type="card" />
						))}
					</div>
				) : (
					<>
						{
							input && <div className="inline-flex items-center gap-4 px-4 py-2 border border-sofluent-gris/20 mt-8 -mb-8 text-sofluent-gris rounded-lg bg-sofluent-gris/5">
            <p>{input}</p>
            <img src={assets.cross_icon} alt="cross_icon"  className="cursor-pointer" onClick={()=> navigate('/course-list')}/>
          </div>
        }

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
							{filteredCourse.length > 0 ? (
								filteredCourse.map((course, index) => (
									<CourseCard key={index} course={course} />
								))
							) : (
								<div className="col-span-full text-center py-20">
									<BrandText size="xl" color="secondary" className="mb-4">
										No courses found
									</BrandText>
									<BrandText size="base" color="tertiary">
										Try adjusting your search terms
									</BrandText>
								</div>
							)}
						</div>
					</>
				)}
			</div>
			<Signature/>
		</StandardPage>
	);
};

export default CoursesList;
