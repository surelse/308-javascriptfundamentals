// Student Assignment Project
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// Assignment Group
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// Learner Submission Data
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function validateInput(course, ag,submissions)
{
  if (ag.course_id!==course.id)
  {
    throw new Error("Assignment Group does not belong to the specified course");
  }

  for (const submission of submissions)
{
  const assignment = ag.assignments.find(a =>a.id===submission.assignment_id);
  if (!assignment)
  {
    throw new Error("Invalid assignment ID ${submission.assignment_id} in submissions.");
  }
  if (assignment.points_possible<=0)
  {
    throw new Error("Invalid points_possible for assignment ${assignment.id}. should be greater than 0");
  }
  if (typeof submission.submission.score!=='number')
  {
    throw new Error("Invalid score type for learner ${submission.learner_id} in assignment ${assignment.id}");
  }
  if (new Date(submission.submission.submitted_at) > new Date(assignment.due_at))
  {
    submission.submission.score -=0.1*assignment.points_possible;
  }
}
}

function calculateAverages(learnerData)
{
  return Object.values(learnerData).map(learner=>{
    const assignments={};
    for (const assignmentID in learner)
    {
      if(assignmentID !== 'id' && assignmentID!=='totalScore' && assignmentID!== 'totalPointsPossible')
      {
        assignments[assignmentID]=learner[assignmentID];
      }
    }

    return{
      id: learner.id,
      avg: learner.totalPointsPossible > 0 ? learner.totalScore/learner.totalPointsPossible : 0,
      ...assignments};
  });
}

function getLearnerData(course, ag, submissions) {
  try{
    validateInput(course, ag, submissions);

    const learnerData={};

    submissions.forEach(submission => {
      const learnerID = submission.learner_id;
      const assignmentID = submission.assignment_id;
      const score= submission.submission.score;
      const pointsPossible=ag.assignments.find(a=>a.id===assignmentID).points_possible;

      if (!learnerData[learnerID])
      {
        learnerData[learnerID] = {
          id:learnerID,
          totalScore:0,
          totalPointsPossible:0
        };
      }
      learnerData[learnerID].totalScore+=score;
      learnerData[learnerID].totalPointsPossible +=pointsPossible;
      learnerData[learnerID][assignmentID]=pointsPossible>0 ? score/pointsPossible:0;

    });
    return calculateAverages(learnerData);
  } catch(error)
  {
    console.error(error.message);
    return[];
  }
}
   const result = getLearnerData(CourseInfo,AssignmentGroup,LearnerSubmissions);
  console.log(result);
