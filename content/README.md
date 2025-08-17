**content**

**content/lessons.en.json**

[
  {
    "slug": "math-fractions-1",  // a short id name for the lesson
    "topic": "Math Basics",     // subject area of the lesson
    "title": "Understanding Fractions",  // name of the lesson
    "body": "A fraction shows parts of a whole. 1/2 means the whole is split into two equal parts and we take one.", // main content
    "estMins": 3,               // estimated minutes to read/learn
    "questions": [              // list of quiz questions
      {
        "prompt": "What does 1/2 mean?",   // the question
        "options": ["1 out of 3", "1 out of 2", "2 out of 1", "None"], // possible answers
        "answer": 1   // correct answer (counting starts from 0 → here "1 out of 2")
      },
      {
        "prompt": "Which is bigger?",  // another question
        "options": ["1/2", "1/3", "Equal", "Can't say"], // answer choices
        "answer": 0   // correct one is "1/2"
      }
    ]
  },
  {
    "slug": "eng-reading-1",   // short id for English lesson
    "topic": "English",        // subject area
    "title": "Reading Tip: Skim First", // name of lesson
    "body": "Skim the text to get the main idea, then read slowly. This improves understanding.", // lesson content
    "estMins": 2,              // takes 2 minutes
    "questions": [             // quiz questions
      {
        "prompt": "What should you do first?", // the question
        "options": ["Read slowly", "Memorize", "Skim", "Skip"], // choices
        "answer": 2   // correct answer is "Skim"
      }
    ]
  },
  {
    "slug": "science-plants-1", // id for Science lesson
    "topic": "Science",         // subject area
    "title": "Plants Need Light", // name of lesson
    "body": "Plants use sunlight to make food through photosynthesis. Light is essential for growth.", // main content
    "estMins": 2,               // takes 2 minutes
    "questions": [              // quiz questions
      {
        "prompt": "What do plants use to make food?", // the question
        "options": ["Soil", "Sunlight", "Water only", "Air only"], // choices
        "answer": 1   // correct is "Sunlight"
      }
    ]



**content/lessons.te.json**

[
  {
    "slug": "math-fractions-1", // unique ID for this lesson (math fractions topic)
    "topic": "గణితం",          // subject is Math
    "title": "భాగాలు (Fractions) అర్థం", // lesson title
    "body": "భాగం ఒక పూర్తిలోని సమాన భాగాలను చూపిస్తుంది. 1/2 అంటే రెండు సమాన భాగాల్లో ఒకటి.", 
    // lesson content: fractions mean equal parts of a whole
    "estMins": 3, // estimated minutes to learn
    "questions": [ // quiz questions list
      {
        "prompt": "1/2 అంటే ఏమిటి?", // question text
        "options": ["3 లో 1", "2 లో 1", "1 లో 2", "ఏదీ కాదు"], // answer choices
        "answer": 1 // correct answer index (0=first, 1=second, etc.)
      },
      {
        "prompt": "ఏది పెద్దది?", // question text
        "options": ["1/2", "1/3", "సమానం", "చెప్పలేం"], // choices
        "answer": 0 // correct answer (first option: 1/2)
      }
    ]
  },
  {
    "slug": "eng-reading-1", // unique ID for this lesson (English reading)
    "topic": "ఇంగ్లీష్", // subject is English
    "title": "ముందు స్కిమ్ చేయండి", // lesson title
    "body": "మొదట టెక్స్ట్‌ను త్వరగా చూసి ప్రధాన భావాన్ని అర్థం చేసుకోండి, ఆపై నెమ్మదిగా చదవండి.", 
    // lesson content: skim first, then read slowly
    "estMins": 2, // estimated minutes
    "questions": [
      {
        "prompt": "ముందుగా ఏం చేయాలి?", // question text
        "options": ["నెమ్మదిగా చదవాలి", "స్మరణలో ఉంచు", "స్కిమ్ చేయండి", "దాటేసి పెట్టండి"], 
        // answer choices
        "answer": 2 // correct answer (3rd option: skim)
      }
    ]
  },
  {
    "slug": "science-plants-1", // unique ID for this lesson (Science - plants)
    "topic": "విజ్ఞానం", // subject is Science
    "title": "ఆకులు కోసం వెలుతురు అవసరం", // lesson title
    "body": "ఆకులు చలనశక్తికి సూర్యరశ్మి ఉపయోగిస్తాయి. పెరుగుదలకు వెలుతురు చాలా ముఖ్యం.", 
    // lesson content: plants need sunlight for food
    "estMins": 2, // estimated minutes
    "questions": [
      {
        "prompt": "ఆకులు ఆహారం తయారుచేసుకోవడానికి ఏని ఉపయోగిస్తాయి?", // question text
        "options": ["మట్టిని", "సూర్య ప్రకాశాన్ని", "కేవలం నీటిని", "కేవలం గాలిని"], 
        // choices
        "answer": 1 // correct answer (second option: sunlight)
      }
    ]
  }
]

  }
]
