import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-soft sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="bg-gradient-to-r from-primary to-secondary p-3 rounded-2xl"
              >
                <ApperIcon name="Sparkles" className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                WordWizlings
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-accent text-gray-800 px-4 py-2 rounded-xl font-medium shadow-card hover:shadow-bubble transition-all duration-200"
            >
              <ApperIcon name="Volume2" className="w-5 h-5" />
              <span className="hidden sm:inline">Sound On</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            animate={{ float: true }}
            className="mb-6 lg:mb-8 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-xl opacity-30"
              />
              <img 
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop&crop=face" 
                alt="Friendly learning mascot"
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-bubble relative z-10"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 bg-accent rounded-full p-2"
              >
                <ApperIcon name="Star" className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </motion.div>
            </div>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-heading font-bold text-gray-800 mb-4 lg:mb-6">
            Welcome, Word
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Wizards!</span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 lg:mb-12 max-w-3xl mx-auto font-medium">
            Let's have fun learning new words and spelling! Choose your grade level and start your magical word adventure! 🎪
          </p>
        </div>
      </motion.section>

      {/* Main Feature */}
      <MainFeature />

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="bg-white mt-16 lg:mt-24 py-8 lg:py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap justify-center items-center space-x-4 lg:space-x-8 mb-6">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center space-x-2 bg-primary bg-opacity-10 px-4 py-2 rounded-xl mb-2"
            >
              <ApperIcon name="Trophy" className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Educational</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center space-x-2 bg-secondary bg-opacity-10 px-4 py-2 rounded-xl mb-2"
            >
              <ApperIcon name="Heart" className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-medium">Kid-Friendly</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center space-x-2 bg-accent bg-opacity-20 px-4 py-2 rounded-xl mb-2"
            >
              <ApperIcon name="Gamepad2" className="w-5 h-5 text-orange-600" />
              <span className="text-orange-600 font-medium">Fun Learning</span>
            </motion.div>
          </div>
          <p className="text-gray-600 font-medium">
            Made with 💝 for young learners everywhere
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home