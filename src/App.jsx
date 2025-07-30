import React, { useState, useEffect } from 'react';
import { Calendar, User, GitBranch, Image, Plus, Save, Download, Upload, Target, Edit, Trash2, Clock } from 'lucide-react';
import { firebaseService } from './firebaseService';

const InternshipTracker = () => {
  const [entries, setEntries] = useState([]);
  const [sprintGoals, setSprintGoals] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    supervisor: '',
    tasks: [''],
    pullRequests: [''],
    images: [''],
    notes: '',
    sprintGoal: '',
    dayOfWeek: '',
    timeline: {
      morning: '',
      afternoon: '',
      evening: ''
    }
  });
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [firebaseConfig, setFirebaseConfig] = useState({
    connected: false
  });
  const [syncStatus, setSyncStatus] = useState({
    lastSync: null,
    isSyncing: false,
    error: null
  });
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [currentSprint, setCurrentSprint] = useState({
    title: '',
    startDate: '',
    endDate: '',
    goals: [''],
    images: [''],
    description: '',
    status: 'active',
    timeline: []
  });
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [showSprintDetails, setShowSprintDetails] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);


  // Auto-connect to Firebase on component mount
  useEffect(() => {
    autoConnectToFirebase();
  }, []);

  // Auto-sync when entries change (debounced)
  useEffect(() => {
    if (firebaseConfig.connected && entries.length > 0) {
      const timeoutId = setTimeout(() => {
        saveToFirebase();
      }, 2000); // 2 second delay to reduce frequency

      return () => clearTimeout(timeoutId);
    }
  }, [entries, firebaseConfig.connected]);

  // REMOVED: loadInitialData function - no longer needed since data is in Firebase
  /*
  const loadInitialData = () => {
    const initialEntries = [
      {
        date: '2025-06-11',
        supervisor: 'Anil Gulecha',
        tasks: [
          'Parent child iframe component connection',
          'Started RAG research and documentation'
        ],
        pullRequests: [],
        images: [],
        notes: 'First day - working on iframe communication components',
        sprintGoal: 'Complete iframe communication setup',
        dayOfWeek: 'Wednesday',
        timeline: {
          morning: 'Started internship under Anil Gulecha. Initial project briefing and setup.',
          afternoon: 'Worked on parent-child iframe component connection for web application communication.',
          evening: 'Began RAG (Retrieval-Augmented Generation) research and documentation preparation.'
        }
      },
      {
        date: '2025-06-12',
        supervisor: 'Anil Gulecha',
        tasks: [
          'Learning RAG application concepts',
          'Building question type system',
          'Understanding RAG workflows'
        ],
        pullRequests: [],
        images: [],
        notes: 'Deep dive into RAG concepts and workflow understanding',
        sprintGoal: 'Master RAG fundamentals',
        dayOfWeek: 'Thursday',
        timeline: {
          morning: 'Learning RAG application concepts and understanding how to build question type systems.',
          afternoon: 'Deep dive into RAG workflows and understanding how to check if someone has understood RAG as a concept.',
          evening: 'Research on converting projects to step-by-step lessons and creating learning paths.'
        }
      },
      {
        date: '2025-06-13',
        supervisor: 'Anil Gulecha',
        tasks: [
          'Created RAG documentation',
          'React iframe child and parent communication',
          'Created NextJS project'
        ],
        pullRequests: ['https://docs.google.com/document/d/19IiTpte56OYN9B43MdaPfJmFrVTbUsJtzT55xho5_Pg/edit?tab=t.0'],
        images: [],
        notes: 'Completed RAG documentation and iframe communication project',
        sprintGoal: 'Document and implement RAG solution',
        dayOfWeek: 'Friday',
        timeline: {
          morning: 'Created comprehensive RAG documentation covering workflows and implementation strategies.',
          afternoon: 'Worked on React iframe child and parent communication for seamless web component integration.',
          evening: 'Created NextJS project to implement the learned concepts and document the complete solution.'
        }
      },
      {
        date: '2025-06-18',
        supervisor: 'Anil Gulecha',
        tasks: [
          'Started Chrome Extension project',
          'Working on browserlinux HTTP requests',
          'Implementing CORS handling for v86'
        ],
        pullRequests: ['https://github.com/kalviumlabs/browserlinux/tree/chromeExtension'],
        images: [],
        notes: 'New project: Chrome extension for HTTP requests in v86 browser-based Linux',
        sprintGoal: 'Build Chrome extension for v86 integration',
        dayOfWeek: 'Wednesday',
        timeline: {
          morning: 'Started new Chrome Extension project for browserlinux. Initial project setup and requirements analysis.',
          afternoon: 'Working on adding and allowing HTTP requests in v86 browser-based Linux system.',
          evening: 'Research on CORS handling approaches and implementation strategies for browser extensions.'
        }
      },
      {
        date: '2025-06-24',
        supervisor: 'Anil Gulecha',
        tasks: [
          'Started working on Lumi Education',
          'Solved login issues',
          'Added 7 components to the system'
        ],
        pullRequests: [],
        images: [],
        notes: 'Successfully resolved login issues and enhanced Lumi Education with new components',
        sprintGoal: 'Enhance Lumi Education platform',
        dayOfWeek: 'Tuesday',
        timeline: {
          morning: 'Started working on Lumi Education platform. Initial codebase exploration and understanding.',
          afternoon: 'Successfully solved login issues that were blocking user access to the platform.',
          evening: 'Added 7 new components to enhance the Lumi Education system functionality and user experience.'
        }
      },
      {
        date: '2025-06-30',
        supervisor: 'Abhinav',
        tasks: [
          'Started v86 course design project',
          'Working on complete v86 system',
          'Creating agent gist files'
        ],
        pullRequests: [],
        images: [],
        notes: 'Beginning of intensive v86 course development with Abhinav',
        sprintGoal: 'Design comprehensive v86 course structure',
        dayOfWeek: 'Monday',
        timeline: {
          morning: 'Started working with Abhinav on v86 course design project. Project kickoff and requirements gathering.',
          afternoon: 'Working on designing the complete v86 working system architecture and course structure.',
          evening: 'Began creating agent gist files for course content and learning materials.'
        }
      },
      {
        date: '2025-07-14',
        supervisor: 'Abhinav',
        tasks: [
          'Completed 10 units of v86 course',
          'Finished all gist files with setup',
          'Created evaluation scripts'
        ],
        pullRequests: [],
        images: [],
        notes: 'Major milestone: Completed 10 units and all required gist files with evaluation scripts',
        sprintGoal: 'Complete 10 course units with evaluation system',
        dayOfWeek: 'Monday',
        timeline: {
          morning: 'Final review and completion of all 10 units of the v86 course with Abhinav.',
          afternoon: 'Finished all gist files with proper setup instructions and configuration.',
          evening: 'Created comprehensive evaluation scripts for course assessment and student progress tracking.'
        }
      },
      {
        date: '2025-07-15',
        supervisor: 'Sales Team',
        tasks: [
          'Started job scraper project',
          'Working with sales team requirements'
        ],
        pullRequests: [],
        images: [],
        notes: 'Transition to sales team collaboration for job scraping solution',
        sprintGoal: 'Develop job scraping solution for sales team',
        dayOfWeek: 'Tuesday',
        timeline: {
          morning: 'Started working with sales team on job scraper project. Requirements gathering and project scope definition.',
          afternoon: 'Working with sales team requirements and understanding their specific needs for job scraping functionality.',
          evening: 'Initial project setup and architecture planning for the job scraper solution.'
        }
      },
      {
        date: '2025-07-21',
        supervisor: 'Anil Gulecha',
        tasks: [
          'Received feedback on job scraper',
          'Added cloud proxy functionality',
          'Implemented GitHub Actions'
        ],
        pullRequests: ['https://github.com/kalviumlabs/jobscraper'],
        images: [],
        notes: 'Enhanced job scraper with cloud proxy and automated deployment via GitHub Actions',
        sprintGoal: 'Implement automated deployment pipeline',
        dayOfWeek: 'Monday',
        timeline: {
          morning: 'Received feedback from Anil on job scraper project. Review of current implementation and improvement suggestions.',
          afternoon: 'Added cloud proxy functionality to enhance the job scraper performance and reliability.',
          evening: 'Implemented GitHub Actions for automated deployment and continuous integration of the job scraper.'
        }
      },
      {
        date: '2025-07-24',
        supervisor: 'Janiem',
        tasks: [
          'Started reporting to Janiem',
          'Team onboarding process'
        ],
        pullRequests: [],
        images: [],
        notes: 'New reporting structure - onboarded to Janiem\'s team',
        sprintGoal: 'Complete team transition and onboarding',
        dayOfWeek: 'Thursday',
        timeline: {
          morning: 'Started reporting to Janiem. Introduction to new team structure and reporting hierarchy.',
          afternoon: 'Team onboarding process - learning about team workflows, communication channels, and project management tools.',
          evening: 'Understanding new team responsibilities and getting familiar with nucleus-apps project structure.'
        }
      },
      {
        date: '2025-07-25',
        supervisor: 'Janiem',
        tasks: [
          'Opened first pull request under new team',
          'Started working on nucleus-apps project'
        ],
        pullRequests: ['https://github.com/Kalvi-Education/nucleus-apps/pull/2608'],
        images: [],
        notes: 'First contribution to nucleus-apps project under new team structure',
        sprintGoal: 'Make first meaningful contribution to nucleus-apps',
        dayOfWeek: 'Friday',
        timeline: {
          morning: 'Started working on nucleus-apps project under Janiem\'s guidance. Codebase exploration and understanding.',
          afternoon: 'Made first meaningful contribution to the project and prepared pull request.',
          evening: 'Opened first pull request to nucleus-apps - marking the beginning of active contribution to the team.'
        }
      },
      {
        date: '2025-07-28',
        supervisor: 'Janiem',
        tasks: [
          'Developed Atom and Molecule components in Storybook',
          'Created Docker file and YAML configuration',
          'Attempted Storybook container build (encountered build error)'
        ],
        pullRequests: [],
        images: [],
        notes: 'Working on component development and containerization - troubleshooting build issues',
        sprintGoal: 'Build containerized Storybook with component library',
        dayOfWeek: 'Monday',
        timeline: {
          morning: 'Worked on developing Atom and Molecule components in Storybook for the component library.',
          afternoon: 'Created Docker file and YAML configuration for containerizing the Storybook application.',
          evening: 'Attempted to build the Storybook container but encountered a build error that needs troubleshooting.'
        }
      }
    ];
    setEntries(initialEntries);
    return initialEntries;
  };
  */

  // REMOVED: loadSprintGoals function - no longer needed since data is in Firebase
  /*
  const loadSprintGoals = () => {
    const sprints = [
      {
        title: 'Sprint 1: Foundation & Setup',
        startDate: '2025-06-11',
        endDate: '2025-06-17',
        goals: ['Complete iframe communication', 'Master RAG concepts', 'Create documentation'],
        images: [],
        description: 'Initial setup phase focusing on foundational technologies and communication protocols.',
        status: 'completed',
        timeline: [
          {
            date: '2025-06-11',
            day: 'Wednesday',
            work: 'Started internship under Anil Gulecha. Worked on parent-child iframe component connection.',
            supervisor: 'Anil Gulecha'
          },
          {
            date: '2025-06-12',
            day: 'Thursday',
            work: 'Learning RAG application concepts and building question type system. Understanding RAG workflows and how to check if someone has understood RAG as a concept.',
            supervisor: 'Anil Gulecha'
          },
          {
            date: '2025-06-13',
            day: 'Friday',
            work: 'Created RAG documentation, worked on React iframe child and parent communication, and created NextJS project.',
            supervisor: 'Anil Gulecha',
            links: ['https://docs.google.com/document/d/19IiTpte56OYN9B43MdaPfJmFrVTbUsJtzT55xho5_Pg/edit?tab=t.0']
          }
        ]
      },
      {
        title: 'Sprint 2: Chrome Extension Development',
        startDate: '2025-06-18',
        endDate: '2025-06-24',
        goals: ['Build Chrome extension', 'Implement CORS handling', 'Enhance Lumi Education'],
        images: [],
        description: 'Development phase for browser extension and educational platform enhancements.',
        status: 'completed',
        timeline: [
          {
            date: '2025-06-18',
            day: 'Wednesday',
            work: 'Started new Chrome Extension project for browserlinux. Working on adding and allowing HTTP requests in v86.',
            supervisor: 'Anil Gulecha',
            links: ['https://github.com/kalviumlabs/browserlinux/tree/chromeExtension']
          },
          {
            date: '2025-06-19',
            day: 'Thursday',
            work: 'Initially tried with proxy approach but received feedback to avoid proxy. Switched to using window function fetch in extension.',
            supervisor: 'Anil Gulecha'
          },
          {
            date: '2025-06-20',
            day: 'Friday',
            work: 'Successfully added CORS headers to HTTPS requests in v86 browser-based Linux.',
            supervisor: 'Anil Gulecha'
          },
          {
            date: '2025-06-24',
            day: 'Tuesday',
            work: 'Started working on Lumi Education. Solved login issues and added 7 components to the system.',
            supervisor: 'Anil Gulecha'
          }
        ]
      },
      {
        title: 'Sprint 3: v86 Course Development',
        startDate: '2025-06-25',
        endDate: '2025-07-14',
        goals: ['Design course structure', 'Create 10 units', 'Build evaluation system'],
        images: [],
        description: 'Comprehensive course development for v86 browser-based Linux system.',
        status: 'completed',
        timeline: [
          {
            date: '2025-06-30',
            day: 'Monday',
            work: 'Started working with Abhinav on v86 course design project. Designing whole v86 working system.',
            supervisor: 'Abhinav'
          },
          {
            date: '2025-07-01',
            day: 'Tuesday',
            work: 'Creating agent gist files and working on course structure.',
            supervisor: 'Abhinav'
          },
          {
            date: '2025-07-02',
            day: 'Wednesday',
            work: 'Continued development of v86 course materials and evaluation scripts.',
            supervisor: 'Abhinav'
          },
          {
            date: '2025-07-03',
            day: 'Thursday',
            work: 'Working on course units and gist files with setup and evaluation scripts.',
            supervisor: 'Abhinav'
          },
          {
            date: '2025-07-04',
            day: 'Friday',
            work: 'Completed 10 units and all gist files with setup and evaluation scripts.',
            supervisor: 'Abhinav'
          }
        ]
      },
      {
        title: 'Sprint 4: Job Scraper & Team Transition',
        startDate: '2025-07-15',
        endDate: '2025-07-28',
        goals: ['Build job scraper', 'Complete team onboarding', 'Contribute to nucleus-apps'],
        images: [],
        description: 'Final phase focusing on automation tools and team integration.',
        status: 'active',
        timeline: [
          {
            date: '2025-07-15',
            day: 'Tuesday',
            work: 'Started working with sales team on job scraper project.',
            supervisor: 'Sales Team'
          },
          {
            date: '2025-07-16',
            day: 'Wednesday',
            work: 'Continued development of job scraper functionality.',
            supervisor: 'Sales Team'
          },
          {
            date: '2025-07-17',
            day: 'Thursday',
            work: 'Working on job scraper features and deployment.',
            supervisor: 'Sales Team'
          },
          {
            date: '2025-07-18',
            day: 'Friday',
            work: 'Completed job scraper development and testing.',
            supervisor: 'Sales Team'
          },
          {
            date: '2025-07-21',
            day: 'Monday',
            work: 'Received feedback from Anil to add cloud proxy. Implemented cloud proxy functionality.',
            supervisor: 'Anil Gulecha',
            links: ['https://github.com/kalviumlabs/jobscraper']
          },
          {
            date: '2025-07-22',
            day: 'Tuesday',
            work: 'GitHub Actions and deployment working perfectly.',
            supervisor: 'Anil Gulecha'
          },
          {
            date: '2025-07-24',
            day: 'Thursday',
            work: 'Started reporting to Janiem. Got onboarded to the team.',
            supervisor: 'Janiem'
          },
          {
            date: '2025-07-25',
            day: 'Friday',
            work: 'Opened first pull request to nucleus-apps.',
            supervisor: 'Janiem',
            links: ['https://github.com/Kalvi-Education/nucleus-apps/pull/2608']
          },
          {
            date: '2025-07-28',
            day: 'Monday',
            work: 'Worked on developing Atom and Molecule components in Storybook. Created Docker file and YAML. Attempted to build Storybook container but encountered build error.',
            supervisor: 'Janiem'
          }
        ]
      }
    ];
    setSprintGoals(sprints);
    return sprints;
  };
  */

  // GitHub Functions
  const autoConnectToFirebase = async () => {
    try {
      setSyncStatus(prev => ({ ...prev, isSyncing: true }));
      
      // Test Firebase connection by fetching existing data
      const result = await firebaseService.getEntries();
      
      if (result.success) {
        // Load entries from Firebase
        const firebaseEntries = result.entries || [];
        
        // Ensure all entries have timeline structure
        const finalEntries = firebaseEntries.map(entry => {
          if (!entry.timeline) {
            return {
              ...entry,
              timeline: {
                morning: '',
                afternoon: '',
                evening: ''
              }
            };
          }
          return entry;
        });
        
        setEntries(finalEntries);
        
        // Load sprint goals from Firebase
        const sprintResult = await firebaseService.getSprintGoals();
        if (sprintResult.success) {
          console.log('✅ Sprint goals loaded from Firebase:', sprintResult.sprintGoals);
          setSprintGoals(sprintResult.sprintGoals || []);
        } else {
          console.log('❌ Failed to load sprint goals:', sprintResult.error);
        }
        
        setFirebaseConfig(prev => ({ ...prev, connected: true }));
        setSyncStatus(prev => ({ 
          ...prev, 
          isSyncing: false, 
          lastSync: new Date().toISOString(),
          error: null
        }));
        // console.log('✅ Connected to Firebase and loaded unified data');
      } else {
        throw new Error(result.error || 'Failed to load data');
      }
    } catch (error) {
      console.error('❌ Failed to connect to Firebase:', error);
      setSyncStatus(prev => ({ 
        ...prev, 
        isSyncing: false, 
        error: error.message 
      }));
    }
  };







  const connectToFirebase = async () => {
    try {
      const result = await firebaseService.getEntries();
      if (result.success) {
        // Firebase has data, load it normally
        const firebaseEntries = result.entries || [];
        
        // Ensure all entries have timeline structure
        const finalEntries = firebaseEntries.map(entry => {
          if (!entry.timeline) {
            return {
              ...entry,
              timeline: {
                morning: '',
                afternoon: '',
                evening: ''
              }
            };
          }
          return entry;
        });
        
        setEntries(finalEntries);
        setFirebaseConfig(prev => ({ ...prev, connected: true }));
        alert('Successfully connected to Firebase!');
      } else {
        alert('Failed to connect to Firebase. Please check your configuration.');
      }
    } catch (error) {
      alert('Error connecting to Firebase: ' + error.message);
    }
  };

  const saveToFirebase = async () => {
    if (!firebaseConfig.connected) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      // Save each entry to Firebase
      for (const entry of entries) {
        if (entry.id) {
          // Update existing entry
          await firebaseService.updateEntry(entry.id, entry);
        } else {
          // Add new entry
          const result = await firebaseService.addEntry(entry);
          if (result.success) {
            // Update the entry with the Firebase ID
            const index = entries.findIndex(e => e === entry);
            if (index !== -1) {
              setEntries(prev => prev.map((e, i) => i === index ? { ...e, id: result.id } : e));
            }
          }
        }
      }

      // console.log('Data saved to Firebase successfully');
      setSyncStatus(prev => ({ 
        ...prev, 
        isSyncing: false, 
        lastSync: new Date().toISOString(),
        error: null
      }));
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSyncStatus(prev => ({ 
        ...prev, 
        isSyncing: false, 
        error: error.message 
      }));
    }
  };



  const uploadImage = async (file) => {
    if (!firebaseConfig.connected) {
      alert('Please connect to Firebase first to upload images');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return null;
    }

    try {
      const result = await firebaseService.uploadImage(file);
      if (result.success) {
        return result.imageUrl;
      } else {
        throw new Error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  // Entry Management Functions
  const addTask = () => {
    setCurrentEntry(prev => ({
      ...prev,
      tasks: [...prev.tasks, '']
    }));
  };

  const updateTask = (index, value) => {
    setCurrentEntry(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }));
  };

  const removeTask = (index) => {
    setCurrentEntry(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const addPullRequest = () => {
    setCurrentEntry(prev => ({
      ...prev,
      pullRequests: [...prev.pullRequests, '']
    }));
  };

  const updatePullRequest = (index, value) => {
    setCurrentEntry(prev => ({
      ...prev,
      pullRequests: prev.pullRequests.map((pr, i) => i === index ? value : pr)
    }));
  };

  const removePullRequest = (index) => {
    setCurrentEntry(prev => ({
      ...prev,
      pullRequests: prev.pullRequests.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    setCurrentEntry(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const updateImage = (index, value) => {
    setCurrentEntry(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const removeImage = (index) => {
    setCurrentEntry(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Sprint Goals Functions
  const addSprintGoal = () => {
    setCurrentSprint(prev => ({
      ...prev,
      goals: [...prev.goals, '']
    }));
  };

  const updateSprintGoal = (index, value) => {
    setCurrentSprint(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? value : goal)
    }));
  };

  const removeSprintGoal = (index) => {
    setCurrentSprint(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const addSprintImage = () => {
    setCurrentSprint(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const updateSprintImage = (index, value) => {
    setCurrentSprint(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const removeSprintImage = (index) => {
    setCurrentSprint(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSprintImageUpload = async (index, file) => {
    if (!firebaseConfig.connected) {
      alert('Please connect to Firebase first to upload images');
      return;
    }

    try {
      const result = await firebaseService.uploadImage(file);
      if (result.success) {
        updateSprintImage(index, result.imageUrl);
      } else {
        alert('Failed to upload image: ' + result.error);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed: ' + error.message);
    }
  };

  const saveSprintGoal = async () => {
    try {
      const filteredSprint = {
        ...currentSprint,
        goals: currentSprint.goals.filter(goal => goal.trim() !== ''),
        images: currentSprint.images.filter(img => img.trim() !== '')
      };

      if (filteredSprint.title.trim() === '') {
        alert('Please enter a sprint title');
        return;
      }

      if (filteredSprint.goals.length === 0) {
        alert('Please add at least one goal');
        return;
      }

      const updatedSprintGoals = [...sprintGoals, filteredSprint];
      setSprintGoals(updatedSprintGoals);

      if (firebaseConfig.connected) {
        const result = await firebaseService.updateSprintGoals(updatedSprintGoals);
        if (result.success) {
          console.log('Sprint goals saved to Firebase successfully');
        } else {
          alert('Failed to save sprint goals: ' + result.error);
        }
      }

      setCurrentSprint({
        title: '',
        startDate: '',
        endDate: '',
        goals: [''],
        images: [''],
        description: '',
        status: 'active',
        timeline: []
      });
      setShowSprintForm(false);
    } catch (error) {
      console.error('Error saving sprint goal:', error);
      alert('Error saving sprint goal: ' + error.message);
    }
  };

  const viewSprintDetails = (sprint) => {
    setSelectedSprint(sprint);
    setShowSprintDetails(true);
  };

  const editSprint = (sprint) => {
    setCurrentSprint(sprint);
    setShowSprintForm(true);
    setShowSprintDetails(false);
  };

  const deleteSprint = async (sprint) => {
    if (confirm(`Are you sure you want to delete "${sprint.title}"?`)) {
      try {
        const updatedSprintGoals = sprintGoals.filter(s => s.title !== sprint.title);
        setSprintGoals(updatedSprintGoals);

        if (firebaseConfig.connected) {
          const result = await firebaseService.updateSprintGoals(updatedSprintGoals);
          if (result.success) {
            console.log('Sprint deleted from Firebase successfully');
          } else {
            alert('Failed to delete sprint: ' + result.error);
          }
        }

        setShowSprintDetails(false);
        setSelectedSprint(null);
      } catch (error) {
        console.error('Error deleting sprint:', error);
        alert('Error deleting sprint: ' + error.message);
      }
    }
  };

  const updateSprint = async () => {
    try {
      const filteredSprint = {
        ...currentSprint,
        goals: currentSprint.goals.filter(goal => goal.trim() !== ''),
        images: currentSprint.images.filter(img => img.trim() !== '')
      };

      if (filteredSprint.title.trim() === '') {
        alert('Please enter a sprint title');
        return;
      }

      if (filteredSprint.goals.length === 0) {
        alert('Please add at least one goal');
        return;
      }

      const updatedSprintGoals = sprintGoals.map(sprint => 
        sprint.title === selectedSprint.title ? filteredSprint : sprint
      );
      setSprintGoals(updatedSprintGoals);

      if (firebaseConfig.connected) {
        const result = await firebaseService.updateSprintGoals(updatedSprintGoals);
        if (result.success) {
          console.log('Sprint updated in Firebase successfully');
        } else {
          alert('Failed to update sprint: ' + result.error);
        }
      }

      // Check if end date was set and create new sprint if needed
      if (filteredSprint.endDate && filteredSprint.endDate !== selectedSprint.endDate) {
        const endDate = new Date(filteredSprint.endDate);
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = nextDay.toISOString().split('T')[0];
        
        // Check if there's already a sprint for the next day
        const existingSprint = updatedSprintGoals.find(sprint => 
          sprint.startDate === nextDayStr
        );
        
        if (!existingSprint) {
          const newSprint = createAutoSprint(nextDayStr);
          const finalSprintGoals = [...updatedSprintGoals, newSprint];
          setSprintGoals(finalSprintGoals);
          
          // Show notification
          setNotification({
            show: true,
            message: `🎯 Auto-created new sprint: "${newSprint.title}" starting from ${nextDayStr}`,
            type: 'success'
          });
          
          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setNotification({ show: false, message: '', type: 'info' });
          }, 5000);
          
          if (firebaseConfig.connected) {
            await firebaseService.updateSprintGoals(finalSprintGoals);
          }
        }
      }

      setCurrentSprint({
        title: '',
        startDate: '',
        endDate: '',
        goals: [''],
        images: [''],
        description: '',
        status: 'active',
        timeline: []
      });
      setShowSprintForm(false);
      setSelectedSprint(null);
    } catch (error) {
      console.error('Error updating sprint:', error);
      alert('Error updating sprint: ' + error.message);
    }
  };

  const handleImageUpload = async (index, file) => {
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      updateImage(index, imageUrl);
    }
  };

  const editEntry = (entry) => {
    setCurrentEntry({
      ...entry,
      timeline: entry.timeline || {
        morning: '',
        afternoon: '',
        evening: ''
      }
    });
    setEditingEntry(entry.date);
    setShowForm(true);
  };

  const deleteEntry = async (entryId) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        if (firebaseConfig.connected) {
          const result = await firebaseService.deleteEntry(entryId);
          if (result.success) {
            setEntries(prev => prev.filter(entry => entry.id !== entryId));
            // console.log('Entry deleted from Firebase successfully');
          } else {
            alert('Failed to delete entry: ' + result.error);
          }
        } else {
          setEntries(prev => prev.filter(entry => entry.id !== entryId));
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Error deleting entry: ' + error.message);
      }
    }
  };

  // Auto-sprint management functions
  const getCurrentSprint = () => {
    const today = new Date().toISOString().split('T')[0];
    return sprintGoals.find(sprint => {
      const startDate = new Date(sprint.startDate);
      const endDate = sprint.endDate ? new Date(sprint.endDate) : null;
      const todayDate = new Date(today);
      return (
        sprint.status === 'active' &&
        todayDate >= startDate &&
        (!endDate || todayDate <= endDate)
      );
    });
  };

  const createAutoSprint = (startDate) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[new Date(startDate).getDay()];
    
    const newSprint = {
      title: `Auto Sprint: ${startDate} (${dayOfWeek})`,
      startDate: startDate,
      endDate: '', // No end date yet - will be set when user edits
      goals: ['Work in progress - Sprint goal to be defined'],
      images: [],
      description: `Automatically created sprint starting from ${startDate}. End date and goals to be defined.`,
      status: 'active',
      timeline: [
        {
          date: startDate,
          day: dayOfWeek,
          work: 'Sprint automatically created - work in progress',
          supervisor: 'Auto-generated'
        }
      ],
      isAutoCreated: true // Flag to identify auto-created sprints
    };
    
    return newSprint;
  };

  const assignEntryToSprint = (entry) => {
    const currentSprint = getCurrentSprint();
    
    if (currentSprint) {
      // Update the entry with the current sprint goal
      const updatedEntry = {
        ...entry,
        sprintGoal: currentSprint.title
      };
      
      // Update sprint with this entry's work
      const updatedSprint = {
        ...currentSprint,
        goals: [...currentSprint.goals, ...entry.tasks.filter(task => task.trim() !== '')],
        timeline: [
          ...currentSprint.timeline,
          {
            date: entry.date,
            day: entry.dayOfWeek,
            work: `${entry.timeline?.morning || ''} ${entry.timeline?.afternoon || ''} ${entry.timeline?.evening || ''}`.trim(),
            supervisor: entry.supervisor
          }
        ]
      };
      
      return { updatedEntry, updatedSprint };
    }
    return { updatedEntry: entry, updatedSprint: null };
  };

  const saveEntry = async () => {
    const filteredEntry = {
      ...currentEntry,
      tasks: currentEntry.tasks.filter(task => task.trim() !== ''),
      pullRequests: currentEntry.pullRequests.filter(pr => pr.trim() !== ''),
      images: currentEntry.images.filter(img => img.trim() !== '')
    };

    try {
      // Check if we need to create a new sprint
      const currentSprint = getCurrentSprint();
      let newSprint = null;
      
      if (!currentSprint) {
        // No active sprint, create one
        newSprint = createAutoSprint(filteredEntry.date);
        setSprintGoals(prev => [...prev, newSprint]);
        
        // Show notification
        setNotification({
          show: true,
          message: `🎯 Auto-created new sprint: "${newSprint.title}" for ${filteredEntry.date}`,
          type: 'success'
        });
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setNotification({ show: false, message: '', type: 'info' });
        }, 5000);
        
        if (firebaseConfig.connected) {
          await firebaseService.updateSprintGoals([...sprintGoals, newSprint]);
        }
      }
      
      // Assign entry to current sprint
      const { updatedEntry, updatedSprint } = assignEntryToSprint(filteredEntry);
      
      if (updatedSprint) {
        // Update sprint goals
        const updatedSprintGoals = sprintGoals.map(sprint => 
          sprint.title === updatedSprint.title ? updatedSprint : sprint
        );
        setSprintGoals(updatedSprintGoals);
        
        if (firebaseConfig.connected) {
          await firebaseService.updateSprintGoals(updatedSprintGoals);
        }
      }

      if (firebaseConfig.connected) {
        if (editingEntry && editingEntry.id) {
          // Update existing entry
          const result = await firebaseService.updateEntry(editingEntry.id, updatedEntry);
          if (result.success) {
            setEntries(prev => prev.map(entry => 
              entry.id === editingEntry.id ? { ...updatedEntry, id: editingEntry.id } : entry
            ));
            // console.log('Entry updated in Firebase successfully');
          } else {
            alert('Failed to update entry: ' + result.error);
            return;
          }
        } else {
          // Add new entry
          const result = await firebaseService.addEntry(updatedEntry);
          if (result.success) {
            setEntries(prev => [...prev, { ...updatedEntry, id: result.id }].sort((a, b) => new Date(b.date) - new Date(a.date)));
            // console.log('Entry added to Firebase successfully');
          } else {
            alert('Failed to add entry: ' + result.error);
            return;
          }
        }
      } else {
        // Save locally if not connected to Firebase
        const existingIndex = entries.findIndex(entry => entry.date === updatedEntry.date);
        if (existingIndex >= 0) {
          setEntries(prev => prev.map((entry, i) => i === existingIndex ? updatedEntry : entry));
        } else {
          setEntries(prev => [...prev, updatedEntry].sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
      }

      setCurrentEntry({
        date: new Date().toISOString().split('T')[0],
        supervisor: '',
        tasks: [''],
        pullRequests: [''],
        images: [''],
        notes: '',
        sprintGoal: '',
        dayOfWeek: '',
        timeline: {
          morning: '',
          afternoon: '',
          evening: ''
        }
      });
      setShowForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Error saving entry: ' + error.message);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'internship-data.json';
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Ensure all imported entries have timeline structure
          const finalEntries = importedData.map(entry => {
            if (!entry.timeline) {
              return {
                ...entry,
                timeline: {
                  morning: '',
                  afternoon: '',
                  evening: ''
                }
              };
            }
            return entry;
          });
          
          setEntries(finalEntries);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setShowImageModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-100 border border-green-300 text-green-800' :
          notification.type === 'error' ? 'bg-red-100 border border-red-300 text-red-800' :
          'bg-blue-100 border border-blue-300 text-blue-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification({ show: false, message: '', type: 'info' })}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-2">🚀 Internship Tracker</h1>
          <p className="text-blue-100 text-lg">Track your daily progress and achievements</p>
          <div className="mt-4 flex items-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Started: June 11, 2025
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              Working Days: {(() => {
                const startDate = new Date('2025-06-11');
                const today = new Date();
                const diffTime = Math.abs(today - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays;
              })()}
            </div>
            <div className="flex items-center gap-2">
              <Target size={16} />
              Total Entries: {entries.length}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">


        {/* Firebase Status and Controls */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-700">
              <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">🔥</span>
              </div>
              <span className="text-sm font-medium">Firebase Auto-sync active</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${syncStatus.isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-orange-500'}`}></div>
                <span className="text-xs text-orange-600">
                  {syncStatus.isSyncing ? 'Syncing...' : 'Connected'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {syncStatus.lastSync && (
                <span className="text-xs text-gray-600">
                  Last sync: {new Date(syncStatus.lastSync).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sprint Goals Section */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target size={20} />
              Sprint Goals
            </h2>
            <button
              onClick={() => setShowSprintForm(!showSprintForm)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200"
            >
              <Plus size={16} />
              Add Sprint
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sprintGoals.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <div className="text-gray-500 mb-4">
                  <Target size={48} className="mx-auto mb-2" />
                  <p className="text-lg font-medium">No Sprint Goals Found</p>
                  <p className="text-sm">Sprint goals will appear here once loaded from Firebase</p>
                </div>
                <button
                  onClick={() => setShowSprintForm(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200"
                >
                  Create First Sprint
                </button>
              </div>
            ) : (
              sprintGoals.map((sprint, index) => {
              const isCurrentSprint = getCurrentSprint()?.title === sprint.title;
              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg p-4 border transition-all duration-200 cursor-pointer transform hover:scale-105 ${
                    isCurrentSprint 
                      ? 'border-green-400 shadow-lg bg-green-50' 
                      : 'border-purple-200 hover:shadow-lg'
                  }`}
                  onClick={() => viewSprintDetails(sprint)}
                >
                <h3 className="font-bold text-purple-800 mb-2">{sprint.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                </p>
                
                {/* Sprint Images Preview */}
                {sprint.images && sprint.images.length > 0 && (
                  <div className="mb-3">
                    <div className="flex gap-2 overflow-x-auto">
                      {sprint.images.slice(0, 3).map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={img}
                          alt={`Sprint ${imgIndex + 1}`}
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ))}
                      {sprint.images.length > 3 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                          +{sprint.images.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <ul className="space-y-1">
                  {sprint.goals.slice(0, 3).map((goal, goalIndex) => (
                    <li key={goalIndex} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">{goal}</span>
                    </li>
                  ))}
                  {sprint.goals.length > 3 && (
                    <li className="text-xs text-purple-600 font-medium">
                      +{sprint.goals.length - 3} more goals...
                    </li>
                  )}
                </ul>
                
                {/* Timeline Preview */}
                {sprint.timeline && sprint.timeline.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-purple-600 font-medium">📅 Work Timeline</span>
                      <span className="text-xs text-gray-500">{sprint.timeline.length} days</span>
                    </div>
                    <div className="space-y-1">
                      {sprint.timeline.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                          <span className="text-gray-600 truncate">{item.work.substring(0, 50)}...</span>
                        </div>
                      ))}
                      {sprint.timeline.length > 2 && (
                        <div className="text-xs text-purple-600 font-medium">
                          +{sprint.timeline.length - 2} more days...
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-purple-600 font-medium">Click to view details →</span>
                </div>
              </div>
            );
          })
            )}
          </div>
        </div>

        {/* Sprint Form */}
        {showSprintForm && (
          <div className="bg-purple-50 rounded-xl p-6 mb-8 border-2 border-purple-200 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-purple-800">
              {selectedSprint ? '✏️ Edit Sprint Goal' : '🎯 Add New Sprint Goal'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sprint Title
                </label>
                <input
                  type="text"
                  value={currentSprint.title}
                  onChange={(e) => setCurrentSprint(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Sprint 1: Foundation & Setup"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={currentSprint.status}
                  onChange={(e) => setCurrentSprint(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={currentSprint.startDate}
                  onChange={(e) => setCurrentSprint(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={currentSprint.endDate}
                  onChange={(e) => setCurrentSprint(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={currentSprint.description}
                onChange={(e) => setCurrentSprint(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of this sprint..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Sprint Goals */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Sprint Goals</label>
              {currentSprint.goals.map((goal, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => updateSprintGoal(index, e.target.value)}
                    placeholder="Describe your goal..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  {currentSprint.goals.length > 1 && (
                    <button
                      onClick={() => removeSprintGoal(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addSprintGoal}
                className="mt-2 flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
              >
                <Plus size={16} />
                Add Goal
              </button>
            </div>

            {/* Sprint Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="inline mr-2" size={16} />
                📸 Sprint Images (Max 5MB each)
              </label>
              {currentSprint.images.map((img, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => updateSprintImage(index, e.target.value)}
                    placeholder="Image URL or upload file..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleSprintImageUpload(index, e.target.files[0])}
                    className="hidden"
                    id={`sprint-image-upload-${index}`}
                  />
                  <label
                    htmlFor={`sprint-image-upload-${index}`}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    Upload
                  </label>
                  {currentSprint.images.length > 1 && (
                    <button
                      onClick={() => removeSprintImage(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addSprintImage}
                className="mt-2 flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
              >
                <Plus size={16} />
                Add Image
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={selectedSprint ? updateSprint : saveSprintGoal}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200"
              >
                <Save size={20} />
                {selectedSprint ? 'Update Sprint' : 'Save Sprint'}
              </button>
              <button
                onClick={() => {
                  setShowSprintForm(false);
                  setSelectedSprint(null);
                  setCurrentSprint({
                    title: '',
                    startDate: '',
                    endDate: '',
                    goals: [''],
                    images: [''],
                    description: '',
                    status: 'active',
                    timeline: []
                  });
                }}
                className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}


        {showSprintDetails && selectedSprint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-purple-800">{selectedSprint.title}</h2>
                    {getCurrentSprint()?.title === selectedSprint.title && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-300">
                        🟢 Currently Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editSprint(selectedSprint)}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSprint(selectedSprint)}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                    <button
                      onClick={() => setShowSprintDetails(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">📅 Timeline</h3>
                    <p className="text-gray-600">
                      {new Date(selectedSprint.startDate).toLocaleDateString()} - {new Date(selectedSprint.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">📊 Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedSprint.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedSprint.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedSprint.status.charAt(0).toUpperCase() + selectedSprint.status.slice(1)}
                    </span>
                  </div>
                </div>

                {selectedSprint.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-2">📝 Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedSprint.description}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">🎯 Goals</h3>
                  <ul className="space-y-2">
                    {selectedSprint.goals.map((goal, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedSprint.timeline && selectedSprint.timeline.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-4">📅 Work Timeline</h3>
                    <div className="space-y-4">
                      {selectedSprint.timeline.map((item, index) => (
                        <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded">
                                {item.day}
                              </span>
                              <span className="text-sm text-gray-600">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {item.supervisor}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">{item.work}</p>
                          {item.links && item.links.length > 0 && (
                            <div className="space-y-1">
                              {item.links.map((link, linkIndex) => (
                                <a
                                  key={linkIndex}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-800 break-all block"
                                >
                                  🔗 {link}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSprint.images && selectedSprint.images.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">📸 Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedSprint.images.map((img, index) => (
                        <div key={index} className="relative group cursor-pointer" onClick={() => openImageModal(img)}>
                          <img
                            src={img}
                            alt={`Sprint ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border border-gray-200 transition-transform duration-200 group-hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Click to view
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => {
              setCurrentEntry({
                date: new Date().toISOString().split('T')[0],
                supervisor: '',
                tasks: [''],
                pullRequests: [''],
                images: [''],
                notes: '',
                sprintGoal: ''
              });
              setEditingEntry(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus size={20} />
            Add New Entry
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Download size={20} />
            Export Data
          </button>
          <label className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer">
            <Upload size={20} />
            Import Data
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>

        {/* Entry Form */}
        {showForm && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border-2 border-blue-200 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingEntry ? '✏️ Edit Entry' : '➕ Add Daily Entry'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Date
                </label>
                                  <input
                    type="date"
                    value={currentEntry.date}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                      const dayOfWeek = dayNames[new Date(selectedDate).getDay()];
                      
                      setCurrentEntry(prev => ({
                        ...prev,
                        date: selectedDate,
                        dayOfWeek,
                        timeline: {
                          morning: '',
                          afternoon: '',
                          evening: ''
                        }
                      }));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline mr-2" size={16} />
                  Supervisor
                </label>
                <select
                  value={currentEntry.supervisor}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, supervisor: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Supervisor</option>
                  <option value="Anil Gulecha">Anil Gulecha</option>
                  <option value="Janiem">Janiem</option>
                  <option value="Abhinav">Abhinav</option>
                  <option value="Sales Team">Sales Team</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="inline mr-2" size={16} />
                  Sprint Goal
                </label>
                <input
                  type="text"
                  value={currentEntry.sprintGoal}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, sprintGoal: e.target.value }))}
                  placeholder="Today's main objective"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Timeline Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline mr-2" size={16} />
                📅 Daily Timeline
              </label>
              
              <div className="space-y-4">
                {/* Morning */}
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">🌅 Morning</label>
                  <textarea
                    value={currentEntry.timeline?.morning || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ 
                      ...prev, 
                      timeline: { 
                        ...prev.timeline, 
                        morning: e.target.value 
                      } 
                    }))}
                    placeholder="What did you work on in the morning?"
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Afternoon */}
                <div>
                  <label className="block text-sm font-medium text-yellow-700 mb-2">☀️ Afternoon</label>
                  <textarea
                    value={currentEntry.timeline?.afternoon || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ 
                      ...prev, 
                      timeline: { 
                        ...prev.timeline, 
                        afternoon: e.target.value 
                      } 
                    }))}
                    placeholder="What did you work on in the afternoon?"
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Evening */}
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">🌙 Evening</label>
                  <textarea
                    value={currentEntry.timeline?.evening || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ 
                      ...prev, 
                      timeline: { 
                        ...prev.timeline, 
                        evening: e.target.value 
                      } 
                    }))}
                    placeholder="What did you work on in the evening?"
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">📋 Tasks Completed</label>
              {currentEntry.tasks.map((task, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => updateTask(index, e.target.value)}
                    placeholder="Describe your task..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {currentEntry.tasks.length > 1 && (
                    <button
                      onClick={() => removeTask(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addTask}
                className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Plus size={16} />
                Add Task
              </button>
            </div>

            {/* Pull Requests Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GitBranch className="inline mr-2" size={16} />
                🔗 Pull Requests / Links
              </label>
              {currentEntry.pullRequests.map((pr, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={pr}
                    onChange={(e) => updatePullRequest(index, e.target.value)}
                    placeholder="https://github.com/..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {currentEntry.pullRequests.length > 1 && (
                    <button
                      onClick={() => removePullRequest(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addPullRequest}
                className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Plus size={16} />
                Add Link
              </button>
            </div>

            {/* Images Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="inline mr-2" size={16} />
                📸 Images / Screenshots (Max 5MB each)
              </label>
              {currentEntry.images.map((img, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="Image URL or upload file..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleImageUpload(index, e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id={`image-upload-${index}`}
                  />
                  <label
                    htmlFor={`image-upload-${index}`}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer flex items-center"
                  >
                    <Upload size={16} />
                  </label>
                  {currentEntry.images.length > 1 && (
                    <button
                      onClick={() => removeImage(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addImage}
                className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Plus size={16} />
                Add Image
              </button>
            </div>

            {/* Notes Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">📝 Notes</label>
              <textarea
                value={currentEntry.notes}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes, challenges faced, learnings..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={saveEntry}
                className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Save size={20} />
                {editingEntry ? 'Update Entry' : 'Save Entry'}
              </button>
              {editingEntry && (
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                    setCurrentEntry({
                      date: new Date().toISOString().split('T')[0],
                      supervisor: '',
                      tasks: [''],
                      pullRequests: [''],
                      images: [''],
                      notes: '',
                      sprintGoal: ''
                    });
                  }}
                  className="flex items-center gap-2 bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* Entries Timeline */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock size={28} />
            Internship Timeline
          </h2>
          
          {entries.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">No entries yet. Add your first entry to get started!</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div 
                key={entry.date}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ 
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-600" />
                    {formatDate(entry.date)}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} />
                      <span className="font-medium">{entry.supervisor}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editEntry(entry)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Entry"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id || entry.date)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete Entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {entry.sprintGoal && (
                  <div className="mb-4 bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-700 mb-1 flex items-center gap-2">
                      <Target size={16} />
                      Sprint Goal:
                    </h4>
                    <p className="text-purple-600">{entry.sprintGoal}</p>
                  </div>
                )}

                {/* Day Timeline */}
                {entry.dayOfWeek && entry.timeline && (
                  <div className="mb-4 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                      <Clock size={16} />
                      📅 {entry.dayOfWeek} Timeline:
                    </h4>
                    <div className="space-y-3">
                      {entry.timeline.morning && (
                        <div className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                          <div>
                            <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded">🌅 Morning</span>
                            <p className="text-gray-700 text-sm mt-1">{entry.timeline.morning}</p>
                          </div>
                        </div>
                      )}
                      {entry.timeline.afternoon && (
                        <div className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                          <div>
                            <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded">☀️ Afternoon</span>
                            <p className="text-gray-700 text-sm mt-1">{entry.timeline.afternoon}</p>
                          </div>
                        </div>
                      )}
                      {entry.timeline.evening && (
                        <div className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                          <div>
                            <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded">🌙 Evening</span>
                            <p className="text-gray-700 text-sm mt-1">{entry.timeline.evening}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {entry.tasks.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      📋 Tasks Completed:
                    </h4>
                    <ul className="space-y-2">
                      {entry.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-600">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {entry.pullRequests.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <GitBranch size={16} />
                      🔗 Links & Pull Requests:
                    </h4>
                    <div className="space-y-2">
                      {entry.pullRequests.map((pr, prIndex) => (
                        <a
                          key={prIndex}
                          href={pr}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-blue-50 p-3 rounded-lg hover:bg-blue-100 break-all"
                        >
                          {pr}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {entry.images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Image size={16} />
                      📸 Images:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {entry.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="space-y-2">
                          {img.startsWith('http') ? (
                            <div className="relative group cursor-pointer" onClick={() => openImageModal(img)}>
                              <img
                                src={img}
                                alt={`Screenshot ${imgIndex + 1}`}
                                className="w-full h-48 object-cover rounded-lg border border-gray-200 transition-transform duration-200 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  Click to view
                                </span>
                              </div>
                            </div>
                          ) : null}
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                            {img}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {entry.notes && (
                  <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      📝 Notes:
                    </h4>
                    <p className="text-yellow-700 italic leading-relaxed">{entry.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Internship Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{entries.length}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {entries.reduce((acc, entry) => acc + entry.tasks.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {entries.reduce((acc, entry) => acc + entry.pullRequests.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Links/PRs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {entries.reduce((acc, entry) => acc + entry.images.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-200 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full size image"
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="hidden text-white text-center mt-4 bg-red-600 p-4 rounded-lg">
              Failed to load image
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InternshipTracker;
