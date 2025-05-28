import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [selectedPuzzleType, setSelectedPuzzleType] = useState(null)
  const [currentPuzzle, setCurrentPuzzle] = useState(null)
  const [userAnswer, setUserAnswer] = useState([])
  const [draggedLetters, setDraggedLetters] = useState([])
  const [score, setScore] = useState(0)
  const [completedPuzzles, setCompletedPuzzles] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [attempts, setAttempts] = useState(0)

  // Word banks for different grades
  const wordBanks = {
    'K': ['CAT', 'DOG', 'SUN', 'BAT', 'HAT', 'RUN', 'FUN', 'BOX', 'TOY', 'CUP'],
    '1': ['BOOK', 'TREE', 'FISH', 'BIRD', 'PLAY', 'JUMP', 'WALK', 'TALK', 'LOOK', 'HELP'],
    '2': ['HAPPY', 'HOUSE', 'WATER', 'SCHOOL', 'FRIEND', 'ANIMAL', 'GARDEN', 'WINTER', 'SUMMER', 'SPRING'],
    '3': ['LIBRARY', 'BICYCLE', 'ELEPHANT', 'COMPUTER', 'SANDWICH', 'RAINBOW', 'FOOTBALL', 'MONSTER', 'PRINCESS', 'DINOSAUR'],
    '4': ['ADVENTURE', 'BUTTERFLY', 'CLASSROOM', 'TELESCOPE', 'PLAYGROUND', 'PINEAPPLE', 'BASKETBALL', 'CELEBRATE', 'CHOCOLATE', 'DISCOVERY']
  }

  const gradeOptions = [
    { id: 'K', name: 'Kindergarten', icon: 'Baby', color: 'from-pink-400 to-red-400', bgColor: 'border-pink-400' },
    { id: '1', name: '1st Grade', icon: 'Flower', color: 'from-purple-400 to-pink-400', bgColor: 'border-purple-400' },
    { id: '2', name: '2nd Grade', icon: 'Star', color: 'from-blue-400 to-purple-400', bgColor: 'border-blue-400' },
    { id: '3', name: '3rd Grade', icon: 'Rocket', color: 'from-green-400 to-blue-400', bgColor: 'border-green-400' },
    { id: '4', name: '4th Grade', icon: 'Crown', color: 'from-yellow-400 to-orange-400', bgColor: 'border-yellow-400' }
  ]

  const puzzleTypes = [
    { 
      id: 'unscramble', 
      name: 'Unscramble', 
      description: 'Put letters in the right order!',
      icon: 'Shuffle',
      color: 'from-primary to-primary-light',
      bgColor: 'bg-primary'
    },
    { 
      id: 'missing', 
      name: 'Missing Letter', 
      description: 'Find the missing letter!',
      icon: 'Search',
      color: 'from-secondary to-secondary-light',
      bgColor: 'bg-secondary'
    },
    { 
      id: 'match', 
      name: 'Picture Match', 
      description: 'Match picture to word!',
      icon: 'Image',
      color: 'from-accent to-orange-400',
      bgColor: 'bg-accent'
    }
  ]

  // Generate puzzle based on type
  const generatePuzzle = (type, word) => {
    switch (type) {
      case 'unscramble':
        const shuffledLetters = word.split('').sort(() => Math.random() - 0.5)
        return {
          type: 'unscramble',
          word: word,
          scrambledLetters: shuffledLetters,
          correctAnswer: word.split(''),
          imageUrl: getWordImage(word)
        }
      
      case 'missing':
        const missingIndex = Math.floor(Math.random() * word.length)
        const wordWithMissing = word.split('')
        const missingLetter = wordWithMissing[missingIndex]
        wordWithMissing[missingIndex] = '_'
        return {
          type: 'missing',
          word: word,
          wordWithMissing: wordWithMissing,
          missingLetter: missingLetter,
          missingIndex: missingIndex,
          imageUrl: getWordImage(word)
        }
      
      case 'match':
        return {
          type: 'match',
          word: word,
          letters: word.split(''),
          imageUrl: getWordImage(word)
        }
      
      default:
        return null
    }
  }

  // Get image for word (using placeholder service)
  const getWordImage = (word) => {
    const imageMap = {
      'CAT': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
      'DOG': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop',
      'SUN': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
      'TREE': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
      'FISH': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop',
      'BIRD': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200&h=200&fit=crop',
      'BOOK': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop',
      'HOUSE': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'
    }
    return imageMap[word] || `https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop&q=80`
  }

  // Start new puzzle
  const startNewPuzzle = () => {
    if (!selectedGrade || !selectedPuzzleType) return
    
    const words = wordBanks[selectedGrade]
    const randomWord = words[Math.floor(Math.random() * words.length)]
    const puzzle = generatePuzzle(selectedPuzzleType, randomWord)
    
    setCurrentPuzzle(puzzle)
    setUserAnswer([])
    setDraggedLetters([])
    setAttempts(0)
  }

  // Check answer
  const checkAnswer = () => {
    if (!currentPuzzle) return

    let isCorrect = false
    setAttempts(prev => prev + 1)

    switch (currentPuzzle.type) {
      case 'unscramble':
        isCorrect = userAnswer.join('') === currentPuzzle.word
        break
      case 'missing':
        isCorrect = userAnswer[currentPuzzle.missingIndex] === currentPuzzle.missingLetter
        break
      case 'match':
        isCorrect = userAnswer.join('') === currentPuzzle.word
        break
    }

    if (isCorrect) {
      setShowSuccess(true)
      setScore(prev => prev + 10)
      setCompletedPuzzles(prev => prev + 1)
      toast.success('🎉 Amazing! You got it right!', {
        position: "top-center",
        className: "text-lg font-bold"
      })
      
      setTimeout(() => {
        setShowSuccess(false)
        startNewPuzzle()
      }, 2000)
    } else {
      toast.error('🤔 Try again! You can do it!', {
        position: "top-center"
      })
      // Reset for retry
      setUserAnswer([])
      setDraggedLetters([])
    }
  }

  // Handle letter drop
  const handleLetterDrop = (letter, index) => {
    const newAnswer = [...userAnswer]
    newAnswer[index] = letter
    setUserAnswer(newAnswer)
    
    if (!draggedLetters.includes(letter)) {
      setDraggedLetters(prev => [...prev, letter])
    }
  }

  // Handle letter click for missing letter puzzle
  const handleLetterClick = (letter) => {
    if (currentPuzzle.type === 'missing') {
      const newAnswer = [...userAnswer]
      newAnswer[currentPuzzle.missingIndex] = letter
      setUserAnswer(newAnswer)
    }
  }

  // Reset game
  const resetGame = () => {
    setSelectedGrade(null)
    setSelectedPuzzleType(null)
    setCurrentPuzzle(null)
    setUserAnswer([])
    setDraggedLetters([])
  }

  useEffect(() => {
    if (selectedGrade && selectedPuzzleType) {
      startNewPuzzle()
    }
  }, [selectedGrade, selectedPuzzleType])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Game Stats */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-4 lg:p-6 shadow-bubble mb-8 lg:mb-12"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-primary bg-opacity-10 rounded-2xl p-3 lg:p-4 mb-2">
              <ApperIcon name="Target" className="w-6 h-6 lg:w-8 lg:h-8 text-primary mx-auto" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-primary">{score}</p>
            <p className="text-sm lg:text-base text-gray-600 font-medium">Score</p>
          </div>
          <div className="text-center">
            <div className="bg-secondary bg-opacity-10 rounded-2xl p-3 lg:p-4 mb-2">
              <ApperIcon name="CheckCircle" className="w-6 h-6 lg:w-8 lg:h-8 text-secondary mx-auto" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-secondary">{completedPuzzles}</p>
            <p className="text-sm lg:text-base text-gray-600 font-medium">Completed</p>
          </div>
          <div className="text-center">
            <div className="bg-accent bg-opacity-20 rounded-2xl p-3 lg:p-4 mb-2">
              <ApperIcon name="Zap" className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600 mx-auto" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-orange-600">{attempts}</p>
            <p className="text-sm lg:text-base text-gray-600 font-medium">Attempts</p>
          </div>
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl p-3 lg:p-4 w-full hover:shadow-bubble transition-all duration-200"
            >
              <ApperIcon name="RotateCcw" className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-1" />
              <p className="text-xs lg:text-sm font-medium">Reset</p>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedGrade ? (
          <motion.div
            key="grade-selection"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl lg:text-4xl font-heading font-bold text-center text-gray-800 mb-8 lg:mb-12">
              Choose Your Grade Level! 🎓
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
              {gradeOptions.map((grade, index) => (
                <motion.div
                  key={grade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`grade-card ${grade.bgColor} cursor-pointer group`}
                >
                  <div className={`bg-gradient-to-r ${grade.color} p-4 lg:p-6 rounded-2xl mb-4 group-hover:shadow-bubble transition-all duration-300`}>
                    <ApperIcon name={grade.icon} className="w-8 h-8 lg:w-12 lg:h-12 text-white mx-auto" />
                  </div>
                  <h4 className="text-lg lg:text-xl font-heading font-bold text-gray-800 text-center mb-2">
                    {grade.name}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-600 text-center font-medium">
                    Perfect for {grade.id === 'K' ? 'little' : 'young'} learners!
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : !selectedPuzzleType ? (
          <motion.div
            key="puzzle-selection"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8 lg:mb-12">
              <h3 className="text-2xl lg:text-4xl font-heading font-bold text-gray-800 mb-4">
                Choose Your Puzzle Type! 🎮
              </h3>
              <p className="text-lg lg:text-xl text-gray-600 font-medium">
                Grade {selectedGrade === 'K' ? 'Kindergarten' : selectedGrade} - Let's play!
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {puzzleTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPuzzleType(type.id)}
                  className="puzzle-card cursor-pointer group"
                >
                  <div className={`${type.bgColor} bg-opacity-10 p-6 lg:p-8 rounded-2xl mb-4 group-hover:bg-opacity-20 transition-all duration-300`}>
                    <ApperIcon name={type.icon} className={`w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-${type.bgColor.split('-')[1]}`} />
                    <h4 className="text-xl lg:text-2xl font-heading font-bold text-gray-800 text-center mb-2">
                      {type.name}
                    </h4>
                    <p className="text-base lg:text-lg text-gray-600 text-center font-medium">
                      {type.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game-play"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className={showSuccess ? 'success-animation' : ''}
          >
            {currentPuzzle && (
              <div className="max-w-4xl mx-auto">
                {/* Puzzle Header */}
                <div className="text-center mb-8 lg:mb-12">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                    {currentPuzzle.imageUrl && (
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        src={currentPuzzle.imageUrl}
                        alt={currentPuzzle.word}
                        className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover shadow-bubble border-4 border-white"
                      />
                    )}
                    <div>
                      <h3 className="text-2xl lg:text-4xl font-heading font-bold text-gray-800 mb-2">
                        {currentPuzzle.type === 'unscramble' && 'Unscramble the Letters!'}
                        {currentPuzzle.type === 'missing' && 'Find the Missing Letter!'}
                        {currentPuzzle.type === 'match' && 'Spell the Word!'}
                      </h3>
                      <p className="text-base lg:text-xl text-gray-600 font-medium">
                        {currentPuzzle.type === 'unscramble' && 'Drag letters to spell the word correctly'}
                        {currentPuzzle.type === 'missing' && 'Click the missing letter to complete the word'}
                        {currentPuzzle.type === 'match' && 'Drag letters to spell what you see in the picture'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Game Area */}
                <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-bubble mb-8">
                  {/* Unscramble Game */}
                  {currentPuzzle.type === 'unscramble' && (
                    <div className="space-y-8">
                      {/* Available Letters */}
                      <div>
                        <h4 className="text-lg lg:text-xl font-bold text-gray-700 mb-4 text-center">
                          Available Letters:
                        </h4>
                        <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
                          {currentPuzzle.scrambledLetters.map((letter, index) => (
                            <motion.div
                              key={`${letter}-${index}`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              drag
                              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                              className={`letter-tile ${draggedLetters.includes(letter) ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}`}
                              onClick={() => {
                                if (!draggedLetters.includes(letter)) {
                                  const nextEmptyIndex = userAnswer.findIndex(item => !item)
                                  if (nextEmptyIndex !== -1) {
                                    handleLetterDrop(letter, nextEmptyIndex)
                                  }
                                }
                              }}
                            >
                              {letter}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Drop Zones */}
                      <div>
                        <h4 className="text-lg lg:text-xl font-bold text-gray-700 mb-4 text-center">
                          Build Your Word:
                        </h4>
                        <div className="flex justify-center gap-2 lg:gap-3">
                          {Array.from({ length: currentPuzzle.word.length }).map((_, index) => (
                            <div
                              key={index}
                              className={`drop-zone ${userAnswer[index] ? 'bg-success text-white border-success' : ''}`}
                            >
                              {userAnswer[index] || ''}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Missing Letter Game */}
                  {currentPuzzle.type === 'missing' && (
                    <div className="space-y-8">
                      {/* Word with Missing Letter */}
                      <div>
                        <h4 className="text-lg lg:text-xl font-bold text-gray-700 mb-4 text-center">
                          Complete the Word:
                        </h4>
                        <div className="flex justify-center gap-2 lg:gap-3 mb-8">
                          {currentPuzzle.wordWithMissing.map((letter, index) => (
                            <div
                              key={index}
                              className={`letter-tile ${letter === '_' ? 'border-accent bg-accent bg-opacity-20' : 'bg-gray-100'} ${
                                letter === '_' && userAnswer[index] ? 'bg-success text-white border-success' : ''
                              }`}
                            >
                              {letter === '_' ? (userAnswer[index] || '?') : letter}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Letter Options */}
                      <div>
                        <h4 className="text-lg lg:text-xl font-bold text-gray-700 mb-4 text-center">
                          Choose the Missing Letter:
                        </h4>
                        <div className="flex justify-center gap-3 lg:gap-4">
                          {/* Generate some wrong options + correct letter */}
                          {[
                            currentPuzzle.missingLetter,
                            String.fromCharCode(65 + Math.floor(Math.random() * 26)),
                            String.fromCharCode(65 + Math.floor(Math.random() * 26)),
                            String.fromCharCode(65 + Math.floor(Math.random() * 26))
                          ]
                            .filter((letter, index, array) => array.indexOf(letter) === index)
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 4)
                            .map((letter, index) => (
                              <motion.div
                                key={`${letter}-${index}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleLetterClick(letter)}
                                className="letter-tile cursor-pointer hover:shadow-bubble"
                              >
                                {letter}
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Match Game */}
                  {currentPuzzle.type === 'match' && (
                    <div className="space-y-8">
                      {/* Available Letters */}
                      <div>
                        <h4 className="text-lg lg:text-xl font-bold text-gray-700 mb-4 text-center">
                          Available Letters:
                        </h4>
                        <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
                          {currentPuzzle.letters.sort(() => Math.random() - 0.5).map((letter, index) => (
                            <motion.div
                              key={`${letter}-${index}`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`letter-tile ${draggedLetters.includes(letter) ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}`}
                              onClick={() => {
                                if (!draggedLetters.includes(letter)) {
                                  const nextEmptyIndex = userAnswer.findIndex(item => !item)
                                  if (nextEmptyIndex !== -1) {
                                    handleLetterDrop(letter, nextEmptyIndex)
                                  }
                                }
                              }}
                            >
                              {letter}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Drop Zones */}
                      <div>
                        <h4 className="text-lg lg:text-xl font-bold text-gray-700 mb-4 text-center">
                          Spell the Word:
                        </h4>
                        <div className="flex justify-center gap-2 lg:gap-3">
                          {Array.from({ length: currentPuzzle.word.length }).map((_, index) => (
                            <div
                              key={index}
                              className={`drop-zone ${userAnswer[index] ? 'bg-success text-white border-success' : ''}`}
                            >
                              {userAnswer[index] || ''}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6 mt-8 lg:mt-12">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={checkAnswer}
                      disabled={!userAnswer.some(letter => letter)}
                      className="game-button disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2"
                    >
                      <ApperIcon name="CheckCircle" className="w-6 h-6" />
                      <span>Check Answer</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setUserAnswer([])
                        setDraggedLetters([])
                      }}
                      className="bg-gradient-to-r from-secondary to-secondary-light text-white font-bold py-4 px-8 rounded-3xl shadow-bubble inline-flex items-center justify-center space-x-2"
                    >
                      <ApperIcon name="RotateCcw" className="w-6 h-6" />
                      <span>Clear</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startNewPuzzle}
                      className="bg-gradient-to-r from-accent to-orange-400 text-gray-800 font-bold py-4 px-8 rounded-3xl shadow-bubble inline-flex items-center justify-center space-x-2"
                    >
                      <ApperIcon name="Shuffle" className="w-6 h-6" />
                      <span>New Puzzle</span>
                    </motion.button>
                  </div>
                </div>

                {/* Success Animation */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                    >
                      <div className="bg-white rounded-3xl p-8 lg:p-12 text-center max-w-md mx-4">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 1 }}
                          className="text-6xl lg:text-8xl mb-4"
                        >
                          🎉
                        </motion.div>
                        <h3 className="text-2xl lg:text-3xl font-heading font-bold text-primary mb-2">
                          Amazing Work!
                        </h3>
                        <p className="text-lg lg:text-xl text-gray-600 font-medium">
                          You spelled "{currentPuzzle.word}" correctly!
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature