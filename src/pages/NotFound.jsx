import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-full inline-block">
            <ApperIcon name="Search" className="w-16 h-16 text-white" />
          </div>
        </motion.div>
        
        <h1 className="text-6xl sm:text-8xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 font-medium">
          Looks like this page got scrambled! Let's get you back to the word games.
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="game-button inline-flex items-center space-x-2"
          >
            <ApperIcon name="Home" className="w-6 h-6" />
            <span>Back to Games</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound