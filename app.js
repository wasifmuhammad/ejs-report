const express = require("express");
const app = express();
const path = require("path");
const puppeteer = require("puppeteer");
const ejs = require("ejs");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

const data = [
  { date: "1 DEC 2022", value: 20 },
  { date: "1 DEC 2022", value: 50 },
];

const data2 = {
  reqData: {
    assessmentId: 1,
    otp: "094565",
    hospitalId: 1,
    doctorId: 6,
    email: "wasif@yopmail.com",
    firstName: "Daud",
    lastName: "Khan",
    cellPhoneNumber: "03219176245",
    dob: 976006383,
    preferredLanguage: '["English", "Russian"]',
    bestTimeToCall: "Morning",
    height: 154,
    weight: 70,
    bmi: 186,
    smoker: false,
    ethnicity: "White",
    doctorData: { firstName: "wasif", lastName: "khan" },
    chronicConditions: ["Diabetes"],
    responses: [
      {
        questionId: 1,
        questionDescription: "How old are you?",
        response: "62",
        screeningSection: "ADA Risk",
      },
      {
        questionId: 2,
        questionDescription:
          "I can manage to solve difficult problems if I try hard enough",
        response: {
          response: "I am a little confident",
          score: 5,
        },
        screeningSection: "Self Efficacy",
      },
      {
        questionId: 3,
        questionDescription:
          "I don't think I have a problem with my exercise and nutrition habits",
        response: {
          response: "I am quite confident",
          score: 5,
        },
        screeningSection: "Prochaska_Diclemente",
      },
      {
        questionId: 4,
        questionDescription:
          "Anyone can talk about wanting to do something about wanting to improve their exercise and nutrition, but I am actually doing something about it",
        screeningSection: "Global Short Form 10",
        response: {
          response: "Yes",
          score: 5,
        },
      },
      {
        questionId: 5,
        questionDescription:
          "I am at the stage where I should think about Improving my exercise and nutrition habits",
        screeningSection: "Prochaska_Diclemente",
        response: {
          response: "Yes",
          score: 5,
        },
      },
      {
        questionId: 6,
        questionDescription:
          "Trying to exercise and improve my nutrition would be pointless for me",
        screeningSection: "Prochaska_Diclemente",
        response: {
          response: "Yes",
          score: 5,
        },
      },
    ],
  },
  riskResponses: [
    {
      questionId: 1,
      questionDescription: "How old are you?",
      response: "39",
      screeningSection: "ADA Risk",
    },
    {
      questionId: 1,
      questionDescription: "Are you a man or woman?",
      response: { response: "Man", score: 1 },
      screeningSection: "ADA Risk",
    },
    {
      questionId: 1,
      questionDescription: "Are you physically active?",
      response: { response: "Yes", score: 0 },

      screeningSection: "ADA Risk",
    },

    {
      questionId: 1,
      questionDescription:
        "Have you ever been diagnosed with gestational diabetes?",
      response: { response: "Yes", score: 0 },

      screeningSection: "ADA Risk",
    },

    {
      questionId: 1,
      questionDescription:
        "Do you have a mother, father, sister or brother with diabetes?",
      response: { response: "No", score: 0 },

      screeningSection: "ADA Risk",
    },

    {
      questionId: 1,
      questionDescription:
        "Do you have a mother, father, sister or brother with diabetes?",
      response: { response: "No", score: 0 },

      screeningSection: "ADA Risk",
    },

    {
      questionId: 1,
      questionDescription: "Have you been diagnosed with high blood pressure?",
      response: { response: "No", score: 0 },
      screeningSection: "ADA Risk",
    },
  ],
  riskRating: "Low Risk",
  riskScoring: 3,
  selfEfficacyResponses: [
    {
      questionId: 2,
      questionDescription:
        "I can manage to solve difficult problems if I try hard enough",
      response: { response: "I am not at all confident", score: 1 },

      screeningSection: "Self Efficacy",
    },

    {
      questionId: 2,
      questionDescription:
        "I am confident that I could deal efficiently with unexpected events",
      response: { response: "I am somewhat confident", score: 3 },

      screeningSection: "Self Efficacy",
    },

    {
      questionId: 2,
      questionDescription: "If I am in trouble, I can think of a solution",
      response: { response: "I am very confident", score: 5 },

      screeningSection: "Self Efficacy",
    },

    {
      questionId: 2,
      questionDescription: "I can handle whatever comes my way",
      response: { response: "I am a little confident", score: 2 },

      screeningSection: "Self Efficacy",
    },
  ],
  globalShortForm10Responses: [
    {
      questionId: 4,
      questionDescription: "In general, would you say your quality of life is:",
      screeningSection: "Global Short Form 10",
      response: {
        response: "Excellent",
        score: 5,
      },
    },

    {
      questionId: 4,
      questionDescription:
        "In general, how would you rate your physical health?",
      screeningSection: "Global Short Form 10",
      response: { response: "Fair", score: 2 },
    },
    {
      questionId: 5,
      questionDescription:
        "In general, how would you rate your mental health, including your mood and your ability to think?",
      screeningSection: "Global Short Form 10",
      response: { response: "Poor", score: 2 },
    },

    {
      questionId: 5,
      questionDescription:
        "In general, how would you rate your satisfaction with your social activities and relationships?",
      screeningSection: "Global Short Form 10",
      response: { response: "Good", score: 2 },
    },

    {
      questionId: 5,
      questionDescription:
        "To what extent are you able to carry out your everyday physical activities such as walking, climbing stairs, carrying groceries, or moving a chair?",
      screeningSection: "Global Short Form 10",
      response: { response: "Not at all", score: 1 },
    },

    {
      questionId: 5,
      questionDescription:
        "How often have you been bothered by emotional problems such as feeling anxious, depressed or irritable?",
      screeningSection: "Global Short Form 10",
      response: { response: "Sometimes", score: 3 },
    },

    {
      sectionId: 3,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription: "How would you rate your fatigue on average?",
      screeningSection: "Global Short Form 10",
      response: { response: "None", score: 5 },
    },
    {
      sectionId: 3,
      questionType: "Number",
      ageType: "Adult",
      questionDescription:
        "On a scale of 0-10 how would you rate your pain on average?",
      screeningSection: "Global Short Form 10",
      response: 7,
    },
  ],

  sdohResponses: [
    {
      sectionId: 4,
      questionType: "Boolean",
      ageType: "Adult",
      questionDescription:
        "In the last 12 months, did you ever eat less than you felt you should. Because there wasn't enough money for food?",
      screeningSection: "SDOH",
      response: { response: "No", score: 0 },
    },
    {
      sectionId: 4,
      questionType: "Boolean",
      ageType: "Adult",
      questionDescription:
        "In the last 12 months, has the electric, gas, oil, or water company threatened to shut off your services in your home?",
      screeningSection: "SDOH",
      response: { response: "Yes", score: 1 },
    },
    {
      sectionId: 4,
      questionType: "Boolean",
      ageType: "Adult",
      questionDescription:
        "Are you worried that in the next 2 months, you may not have stable housing?",
      screeningSection: "SDOH",
      response: { response: "No", score: 0 },
    },
    {
      sectionId: 4,
      questionType: "Boolean",
      ageType: "Adult",
      questionDescription:
        "Do problems getting child care make it difficult for you to work or study?",
      screeningSection: "SDOH",
      response: { response: "Yes", score: 1 },
    },
    {
      sectionId: 4,
      questionType: "Boolean",
      ageType: "Adult",
      questionDescription:
        "In the last 12 months, have you needed to see a doctor, but could not because of costs?",
      screeningSection: "SDOH",
      response: { response: "Yes", score: 1 },
    },
    {
      sectionId: 4,
      questionType: "Boolean",
      ageType: "Adult",
      questionDescription:
        "In the last 12 months, have you ever had to go without health care because you didn't have a way to get there?",
      screeningSection: "SDOH",
      response: { response: "Yes", score: 1 },
    },
    {
      sectionId: 4,
      questionType: "Boolean",
      ageType: "Adult",
      questionDescription: "Do you ever need help reading hospital materials?",
      screeningSection: "SDOH",
      response: { response: "No", score: 0 },
    },
    {
      sectionId: 4,
      questionType: "Boolean",
      ageType: "Adult",
      questionDescription: "I often feel that I lack companionship.",
      screeningSection: "SDOH",
      response: { response: "Yes", score: 1 },
    },
    {
      sectionId: 4,
      questionType: "Boolean",
      ageType: "Adult",
      questionDescription:
        "Are any of your needs urgent? For example: I don't have food tonight, I don't have a place to sleep tonight",
      screeningSection: "SDOH",
      response: { response: "Yes", score: 1 },
    },
    {
      sectionId: 4,
      questionType: "Boolean",
      ageType: "Adult",
      questionDescription:
        "If you checked YES to any boxes above, would you like to receive assistance with any of these needs?",
      screeningSection: "SDOH",
      response: { response: "No", score: 0 },
    },
  ],
  procheskaDiclementeResponses: [
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "I don't think I have a problem with my exercise and nutrition habits",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Strongly disagree", score: -2 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "I am trying to improve my exercise and nutrition habits",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Strongly agree", score: 2 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "I enjoy my unhealthy foods, but sometimes I eat too much.",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Disagree", score: -1 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "Sometimes I think I should cut back on my 'unhealthy food intake'",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Agree", score: 1 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "Its a waste of time thinking about my exercise and nutrition habits",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Unsure", score: 0 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "I have just recently adjusted my exercise and nutrition habit",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Strongly disagree", score: -2 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "Anyone can talk about wanting to do something about wanting to improve their exercise and nutrition, but I am actually doing something about it",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Disagree", score: -1 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "I am at the stage where I should think about Improving my exercise and nutrition habits",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Agree", score: 1 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "My 'Exercise and nutrition habits' is a problem sometimes",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Strongly disagree", score: -2 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "There is no need for me to think about changing 'Exercise and nutrition habits'",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Strongly agree", score: 2 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "I am actually changing my Exercise and nutrition habits right now.",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Disagree", score: -1 },
    },
    {
      sectionId: 5,
      questionType: "Radio",
      ageType: "Adult",
      questionDescription:
        "Trying to exercise and improve my nutrition would be pointless for me",
      screeningSection: "Prochaska_Diclemente",
      response: { response: "Strongly disagree", score: -2 },
    },
  ],
  pathwayIntervention: {
    pathwayIntervention:
      "Not eligible for RPM, but should receive ongoing emails and/or texts about healthy living, chronic conditions, and health risks",
  },
  rpmRecommendations: "Enroll in RPM",
  selfEfficacyTScore: 0,
  selfEfficacyRecommendation:
    "Patients with a very low self-efficacy score are least likely to achieve their goals and overcome barriers without extensive support.  Take small incremental steps and breakdown tasks to make it easier for them to understand and follow.  Be patient and provide positive reinforcement with  minimal progress.  Educate them on the resources available to them through the app and on how to communicate questions, concerns, and request support.  It is important they feel comfortable to ask for help.",
  selfEfficacyRating: "Very Low",
  physicalHealthRating: "Poor",
  physicalHealthScoreTScore: 0,
  physicalHealthRecommendation:
    "PROMIS Mental Health rating of Poor indicates the patient feels their current services are least positively impacting their health outcomes. PreventScripts Daily Tips, Weekly Surveys, and Monthly RPM services are designed to improve these scores over time.",
  mentalHealthRating: "Poor",
  mentalHealthRecommendation:
    "PROMIS Mental Health rating of Poor indicates the patient feels their current services are least positively impacting their health outcomes. PreventScripts Daily Tips, Weekly Surveys, and Monthly RPM services are designed to improve these scores over time.",
  mentalHealthScoreTScore: 0,
  physicalHealthScore: 0,
  motivationStage: "Pre-contemplative",
  motivationStageRecommendation:
    "Patients in the pre-contemplative stage have not acknowledged that their behaviors are problematic.  Use their Risk data to increase awareness and generate concern about their current pattern of behaviors and/or get them interested in a new healthy behavior.",
  sdohPostiveResponses: [
    "If you checked YES to any boxes above, would you like to receive assistance with any of these needs?",
    "Are any of your needs urgent? For example: I don't have food tonight, I don't have a place to sleep tonight",
    "I often feel that I lack companionship.",
    "Do you ever need help reading hospital materials?",
    "In the last 12 months, have you ever had to go without health care because you didn't have a way to get there?",
    "In the last 12 months, have you needed to see a doctor, but could not because of costs?",
    "Do problems getting child care make it difficult for you to work or study?",
    "Are you worried that in the next 2 months, you may not have stable housing?",
    "In the last 12 months, has the electric, gas, oil, or water company threatened to shut off your services in your home?",
    "In the last 12 months, did you ever eat less than you felt you should. Because there wasn't enough money for food?",
  ],
  firstPhysicalAndMentalHealthScore: {
    physicalHealthRating: "Poor",
    physicalHealthScoreTScore: 10,
    physicalHealthRecommendation:
      "PROMIS Mental Health rating of Poor indicates the patient feels their current services are least positively impacting their health outcomes. PreventScripts Daily Tips, Weekly Surveys, and Monthly RPM services are designed to improve these scores over time.",
    mentalHealthRating: "Poor",
    mentalHealthRecommendation:
      "PROMIS Mental Health rating of Poor indicates the patient feels their current services are least positively impacting their health outcomes. PreventScripts Daily Tips, Weekly Surveys, and Monthly RPM services are designed to improve these scores over time.",
    mentalHealthScoreTScore: 10,
    physicalHealthScore: 10,
    date: "29 | Nov | 2023",
  },
  latestPhysicalAndMentalHealthScore: {
    physicalHealthRating: "Excellent",
    physicalHealthScoreTScore: 20,
    physicalHealthRecommendation:
      "PROMIS Mental Health rating of Poor indicates the patient feels their current services are least positively impacting their health outcomes. PreventScripts Daily Tips, Weekly Surveys, and Monthly RPM services are designed to improve these scores over time.",
    mentalHealthRating: "Poor",
    mentalHealthRecommendation:
      "PROMIS Mental Health rating of Poor indicates the patient feels their current services are least positively impacting their health outcomes. PreventScripts Daily Tips, Weekly Surveys, and Monthly RPM services are designed to improve these scores over time.",
    mentalHealthScoreTScore: 20,
    physicalHealthScore: 77,
    date: "30 | Nov | 2023",
  },
  formattedDOB: "5th Dec, 2000",
  dateSubmitted: "15th Dec, 2023",
};

const {
  reqData,
  riskResponses,
  riskRating,
  riskScoring,
  selfEfficacyResponses,
  globalShortForm10Responses,
  sdohResponses,
  procheskaDiclementeResponses,
  pathwayIntervention,
  rpmRecommendations,
  selfEfficacyTScore,
  selfEfficacyRecommendation,
  selfEfficacyRating,
  physicalHealthRating,
  physicalHealthScoreTScore,
  physicalHealthRecommendation,
  mentalHealthRating,
  mentalHealthRecommendation,
  mentalHealthScoreTScore,
  physicalHealthScore,
  motivationStage,
  motivationStageRecommendation,
  sdohPostiveResponses,
  firstPhysicalAndMentalHealthScore,
  latestPhysicalAndMentalHealthScore,
  formattedDOB,
  dateSubmitted,
  doctorData,
  chronicConditions,
} = data2;
app.get("/", (req, res) => {
  res.render("report", {
    reqData: {
      ...reqData,
      preferredLanguage: JSON.stringify(reqData.preferredLanguage),
    },
    riskResponses,
    lastName: "wasif",
    firstName: "khan",
    dateOfBirth: "123123",
    dateOfReport: "12323",
    riskRating,
    riskScoring,
    selfEfficacyResponses,
    globalShortForm10Responses,
    sdohResponses,
    procheskaDiclementeResponses,
    pathwayIntervention,
    rpmRecommendations,
    selfEfficacyTScore,
    selfEfficacyRecommendation,
    selfEfficacyRating,
    physicalHealthRating,
    physicalHealthScoreTScore,
    physicalHealthRecommendation,
    mentalHealthRating,
    mentalHealthRecommendation,
    mentalHealthScoreTScore,
    physicalHealthScore,
    motivationStage,
    motivationStageRecommendation,
    sdohPostiveResponses,
    firstPhysicalAndMentalHealthScore,
    latestPhysicalAndMentalHealthScore,
    formattedDOB,
    dateSubmitted,
    doctorData,
    bmiScore: 12,
    preferredLanguage: ["English", "Russian"],
    chronicConditions: ["Fever", "Dumyy"],
    clinicReportText: "wsif",
  });
});

app.get("/download", async (req, res) => {
  const renderedHtml = await ejs.renderFile(
    path.join(__dirname, "views", "report.ejs"),
    {
      reqData: {
        ...reqData,
        preferredLanguage: JSON.stringify(reqData.preferredLanguage),
      },
      riskResponses,
      riskRating,
      riskScoring,
      selfEfficacyResponses,
      globalShortForm10Responses,
      sdohResponses,
      procheskaDiclementeResponses,
      pathwayIntervention,
      rpmRecommendations,
      selfEfficacyTScore,
      selfEfficacyRecommendation,
      selfEfficacyRating,
      physicalHealthRating,
      physicalHealthScoreTScore,
      physicalHealthRecommendation,
      mentalHealthRating,
      mentalHealthRecommendation,
      mentalHealthScoreTScore,
      physicalHealthScore,
      motivationStage,
      motivationStageRecommendation,
      sdohPostiveResponses,
      firstPhysicalAndMentalHealthScore,
      latestPhysicalAndMentalHealthScore,
      formattedDOB,
      dateSubmitted,
      bmiScore: 12,
      doctorData: { firstName: "wasif", lastName: "khan", hospital: "ABCS" },
      preferredLanguage: ["English"],
      chronicConditions: ["Fever", "Dumyy"],
    }
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Use the rendered HTML content
  await page.setContent(renderedHtml);

  // Generate PDF directly
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  // Close the browser
  await browser.close();

  // Send the PDF buffer as a response
  res.setHeader("Content-Type", "application/pdf");
  res.send(pdfBuffer);
});

app.get("/report", (req, res) => {
  res.render("patient", {
    lastName: "Doe",
    firstName: "John",
    dateOfBirth: "01/01/1990",
    dateOfReport: "04/17/2024",
    planSubmittedAt: "04/15/2024",
    planGoal: "Lose weight",
    planMotivation: "to improve overall health",
    planBarrier: "Lack of time for exercise",
    planSelectedOption: "Option A",
    scientificRecommendation:
      "Increase physical activity and reduce calorie intake",
    weightDifference: -3,
    joinedAt: "04/17/2024",
    yesterdayWaterIntake: 60,
    todayWaterIntake: 72,
    yesterdayFruitIntake: 3,
    todayFruitIntake: 4,
    yesterdayVegetableIntake: 6,
    todayVegetableIntake: 7,
    lastMonthStepsAvg: 8000,
    thisMonthStepsAvg: 8500,
    thisMonthOpened: 25,
    lastMonthOpened: 30,
    totalWeighInsThisMonth: 10,
    bmi: 24.5,
    startingBmi: 25.1,
    latestBloodPressure: { systolic: 120, dystolic: 80 },
    latestBloodPressureDate: "04/16/2024",
    latestWeight: { value: 160 },
    latestWeightDate: "04/17/2024",
    latestBloodSugar: { value: 90 },
    latestBloodSugarDate: "04/15/2024",
    latestWaist: { value: 32 },
    latestWaistDate: "04/14/2024",
    weightValues: [160, 158, 157, 156, 155, 154, 153],
    weightDates: [
      "04/10/2024",
      "04/11/2024",
      "04/12/2024",
      "04/13/2024",
      "04/14/2024",
      "04/15/2024",
      "04/16/2024",
    ],
    firstRecordedWeight: 165,
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
