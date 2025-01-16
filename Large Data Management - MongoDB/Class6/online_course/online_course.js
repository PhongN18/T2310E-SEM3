// List of courses and the number of students enrolled
db.createView(
    "course_enrollment_summary",
    "students",
    [
        { $unwind: "$enrolledCourses" },
        { $lookup: {
                from: "courses",
                localField: "enrolledCourses",
                foreignField: "courseId",
                as: "courseDetails"
            }
        },
        { $unwind: "$courseDetails" },
        { $group: {
                _id: { courseId: "$courseDetails.courseId", courseName: "$courseDetails.name" },
                studentsEnrolled: { $sum: 1 }
            }
        },
        { $project: {
                _id: 0,
                courseId: "$_id.courseId",
                courseName: "$_id.courseName",
                studentsEnrolled: "$studentsEnrolled"
            }
        },
        { $sort: { courseId: 1 } }
    ]
)

// Average score of students in each course
db.createView(
    "avg_score_per_course",
    "test_results",
    [
        { $lookup: {
                from: "tests",
                localField: "testId",
                foreignField: "testId",
                as: "testDetails"
            }
        },
        { $unwind: "$testDetails" },
        {
            $lookup: {
                from: "courses",
                localField: "testDetails.courseId",
                foreignField: "courseId",
                as: "courseDetails"
            }
        },
        { $unwind: "$courseDetails" },
        {
            $group: {
                _id: { courseId: "$courseDetails.courseId", courseName: "$courseDetails.name" },
                testTaken: { $sum: 1 },
                avgScore: { $avg: "$score" }
            }
        },
        {
            $project: {
                _id: 0,
                courseId: "$_id.courseId",
                courseName: "$_id.courseName",
                testTaken: "$testTaken",
                avgScore: { $round: ["$avgScore", 2] }
            }
        },
        { $sort: { courseId: 1 } }
    ]
)

// Numbers of pass and fail students
db.createView(
    "pass_fail_summary",
    "test_results",
    [
        {
            $lookup: {
                from: "tests",
                localField: "testId",
                foreignField: "testId",
                as: "testDetails"
            }
        },
        { $unwind: "$testDetails" },
        {
            $lookup: {
                from: "courses",
                localField: "testDetails.courseId",
                foreignField: "courseId",
                as: "courseDetails"
            }
        },
        { $unwind: "$courseDetails" },
        {
            $group: {
                _id: { courseId: "$courseDetails.courseId", courseName: "$courseDetails.name", testId: "$testDetails.testId", testTitle: "$testDetails.title" },
                testTaken: { $sum: 1 },
                passed: { $sum: { $cond: [{ $gte: ["$score", { $divide: ["$testDetails.totalMarks", 2] }] }, 1, 0] } },
                failed: { $sum: { $cond: [{ $lt: ["$score", { $divide: ["$testDetails.totalMarks", 2] }] }, 1, 0] } },
            }
        },
        {
            $addFields: {
                passedPercentage: { $sum: { $divide: [{ $multiply: ["$passed", 100] }, "$testTaken"] } }
            }
        },
        {
            $project: {
                _id: 0,
                courseName: "$_id.courseName",
                testTitle: "$_id.testTitle",
                testTaken: "$testTaken",
                passed: "$passed",
                failed: "$failed",
                passedPercentage: { $round: ["$passedPercentage", 2]} 
            }
        }
    ]
)