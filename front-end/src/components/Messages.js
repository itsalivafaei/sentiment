// Define status messages for each state
export const statusMessages = {
    passive: [
      "You're so much closer! Keep going! 🚀",
      "Almost there, try more! 💪",
      "You're on the right track! 🎯",
      "Don't hold back, share more! 📝",
      "Keep it up, you're doing great! 👍"
    ],
    waiting: [
      "Now start! I'm all ears! 👂",
      "Say your thoughts! 🗣️",
      "Go ahead, express yourself! 🎤",
      "Start typing your feelings! 🖋️",
      "Express yourself here! 💬"
    ],
    thinking: [
      "I'm listening... 🎧",
      "Waiting until the end... ⏳",
      "Processing your thoughts... 🔄",
      "Thinking about what you wrote... 🤔",
      "Analyzing your input... 📊"
    ],
    sleeping: [
        "I'm enjoying labeling other thoughts! 💤 Let me know yours...",
        "Hey there! Ready to share your feelings? 😊",
        "Feel free to type in your thoughts for sentiment analysis! 📈",
        "Your thoughts matter! Start typing to get insights. 🧠",
        "Let's dive into your emotions. Type something! 🌊"
    ],
    typing: [
      "I'm figuring out your emotions... 🕵️‍♂️",
      "Processing your sentiment analysis... 🔍",
      "Crunching the numbers... 🧮",
      "Analyzing your feelings... 💖",
      "Understanding your emotions... 🧘‍♀️"
    ],
    stressed: [
      "Trying to figure out the results... 🧐",
      "Determining your emotional state... 🧭",
      "Analyzing data... 📈",
      "Working on your sentiment analysis... 🔧",
      "Processing information... 🗄️"
    ],
    finished: [
      "All done! 🎉",
      "Analysis complete! ✅",
      "Your sentiment is ready! 📃",
      "Done! Feel free to share more thoughts. 🤗",
      "Finish! Ready for your next input. 🚀"
    ]
  };

  // Helper function to get a random message from a set
export const getRandomMessage = (messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };