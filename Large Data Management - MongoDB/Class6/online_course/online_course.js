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

// Numbers of pass and fail students (>= 60%)
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
                passed: { $sum: { $cond: [{ $gte: ["$score", { $divide: [{ $multiply: ["$testDetails.totalMarks", 3] }, 5] }] }, 1, 0] } },
                failed: { $sum: { $cond: [{ $lt: ["$score", { $divide: [{ $multiply: ["$testDetails.totalMarks", 3] }, 5] }] }, 1, 0] } },
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

// Active students(based on tests taken) each month and most active courses
db.createView(
    "active_students_per_month",
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
            $group: {
                _id: { year: { $year: "$dateTaken" }, month: { $month: "$dateTaken" }, courseId: "$testDetails.courseId" },
                testsTaken: { $sum: 1 }
            }
        },
        { $sort: { testsTaken: -1 } },
        {
            $group: {
                _id: { year: "$_id.year", month: "$_id.month" },
                total: { $sum: "$testsTaken" },
                courseId: { $first: "$_id.courseId" },
                students: { $first: "$testsTaken" }
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "courseId",
                as: "courseDetails"
            }
        },
        { $unwind: "$courseDetails" },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                activeStudents: "$total",
                mostActiveCourse: "$courseDetails.name",
                students: "$students"
            }
        },
        { $sort: { year: 1, month: 1 } }
    ]
)