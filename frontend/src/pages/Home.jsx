import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Zap, Users, Star, ArrowRight, CheckCircle, Brain, Target, ShieldCheck } from 'lucide-react';

const Home = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-dark-900 text-gray-100 overflow-x-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dark-900 via-dark-900 to-primary-900/20 z-0" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block py-1 px-3 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium border border-primary-500/20 mb-4">
                🚀 The future of learning is here
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-100 to-primary-200">
                A joyful way to learn <br /> and level up
              </h1>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Master new skills with bite-sized lessons, interactive challenges, and game-like quizzes. Join a community of learners today.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 w-full sm:w-auto flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/courses" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                Browse Courses
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. WHAT IS LEARNSPHERE */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose LearnSphere?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We combine proven learning techniques with game mechanics to keep you motivated.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: BookOpen, title: "Structured Learning", desc: "Curated paths from beginner to pro." },
            { icon: Target, title: "Targeted Practice", desc: "Hands-on exercises that stick." },
            { icon: Trophy, title: "Competitive Quizzes", desc: "Challenge friends and climb ranks." },
            { icon: Zap, title: "Instant Feedback", desc: "Know where you stand immediately." }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-dark-900 border border-dark-800 hover:border-primary-500/30 transition-all text-center group"
            >
              <div className="w-14 h-14 rounded-xl bg-dark-800 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/10 transition-colors">
                <feature.icon className="w-7 h-7 text-primary-400 group-hover:text-primary-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-24 bg-dark-900 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <div className="h-1 w-20 bg-primary-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-dark-700 -z-10" />

            {[
              { step: "01", title: "Learn", desc: "Pick a skill path." },
              { step: "02", title: "Practice", desc: "Solve real problems." },
              { step: "03", title: "Quiz", desc: "Test your knowledge." },
              { step: "04", title: "Level Up", desc: "Earn badges & XP." }
            ].map((item, idx) => (
              <div key={idx} className="text-center relative bg-dark-900 md:bg-transparent p-4">
                <div className="w-12 h-12 rounded-full bg-dark-800 border-2 border-primary-500/50 text-primary-400 flex items-center justify-center font-bold text-lg mx-auto mb-6 z-10 relative">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURE PREVIEW */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Explore Features</h2>
            <p className="text-gray-400">Sneak peek into what you get.</p>
          </div>
          <Link to="/register" className="text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium">
            View all features <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course Card */}
          <Link to="/register" className="group relative overflow-hidden rounded-2xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all">
            <div className="h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-400/50 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">Interactive Courses</h3>
              <p className="text-gray-400 text-sm">Rich content with video, text, and code editors built right in.</p>
            </div>
          </Link>

          {/* Quiz Card */}
          <Link to="/register" className="group relative overflow-hidden rounded-2xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all">
            <div className="h-48 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 flex items-center justify-center">
              <Brain className="w-16 h-16 text-yellow-400/50 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">Smart Quizzes</h3>
              <p className="text-gray-400 text-sm">Adaptive questions that test your understanding, not just memory.</p>
            </div>
          </Link>

          {/* Multiplayer Card */}
          <Link to="/register" className="group relative overflow-hidden rounded-2xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all md:col-span-2 lg:col-span-1">
            <div className="h-48 bg-gradient-to-br from-green-900/20 to-emerald-900/20 flex items-center justify-center">
              <Users className="w-16 h-16 text-green-400/50 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">Multiplayer Arena</h3>
              <p className="text-gray-400 text-sm">Compete with friends in real-time quiz battles.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. WHY LEARNSPHERE / BENEFITS */}
      <section className="py-24 bg-dark-900 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Designed for <span className="text-primary-400">retention</span>, not just completion.
            </h2>
            <p className="text-lg text-gray-400">
              Most platforms focus on video hours. We focus on how much you actually remember. Our spaced repetition and gamification ensures long-term mastery.
            </p>

            <ul className="space-y-4">
              {[
                "Byte-sized lessons (< 15 mins)",
                "Instant code validation",
                "Peer-to-peer learning",
                "Certificates of completion"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-gold" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/register" className="btn-primary inline-flex items-center gap-2 mt-4">
              Start Learning Now
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-accent-purple opacity-20 blur-2xl rounded-3xl" />
            <div className="relative bg-dark-900 p-8 rounded-2xl border border-dark-800 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 border-b border-dark-800 pb-4">
                <div className="w-12 h-12 rounded-full bg-dark-800 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-dark-800 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-dark-800 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-24 bg-dark-800 rounded-lg animate-pulse" />
                <div className="h-24 bg-dark-800 rounded-lg animate-pulse delay-100" />
                <div className="h-24 bg-dark-800 rounded-lg animate-pulse delay-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MULTIPLAYER PREVIEW SPECIFIC */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <div className="mb-10 inline-flex items-center justify-center p-4 rounded-full bg-accent-purple/10 text-accent-purple mb-6">
          <Users className="w-8 h-8 mr-3" />
          <span className="font-bold text-xl">Multiplayer Mode</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Learning is better together
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Create a room, invite your friends, and see who climbs the leaderboard faster. Real-time sync, instant results.
        </p>

        <div className="relative rounded-2xl overflow-hidden border border-dark-700 shadow-2xl bg-dark-900 p-8 md:p-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-purple to-accent-gold" />
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 opacity-50 blur-[1px] hover:blur-none hover:opacity-100 transition-all duration-500">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-primary-600 mx-auto flex items-center justify-center text-2xl font-bold">JD</div>
              <div className="font-mono text-primary-400">1200 XP</div>
            </div>
            <div className="text-2xl font-bold text-gray-600">VS</div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-accent-purple mx-auto flex items-center justify-center text-2xl font-bold">ME</div>
              <div className="font-mono text-accent-purple">1150 XP</div>
            </div>
          </div>
          <div className="mt-8">
            <Link to="/login" className="btn-secondary">Play after signing in</Link>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start learning the fun way</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of learners who have switched to LearnSphere. No credit card required.
          </p>
          <Link to="/register" className="btn-primary text-xl px-10 py-5 shadow-xl shadow-primary-500/20 hover:scale-105 transition-transform">
            Get Started for Free
          </Link>
          <p className="mt-6 text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-primary-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </section>

    </div>
  );
};

export default Home;
