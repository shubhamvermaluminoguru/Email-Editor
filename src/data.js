// Function to generate random date within a specified range
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  
  // Generate page hit data for each course over a span of three months
function generatePageHitsData() {
    const startDate = new Date('2023-12-12');
    const endDate = new Date('2024-12-31');
    
    const courses = [
      { courseId: 'c1', courseName: 'English' },
      { courseId: 'c2', courseName: 'Maths' },
      { courseId: 'c3', courseName: 'Hindi' },
      { courseId: 'c4', courseName: 'Science' },
      { courseId: 'c5', courseName: 'History' }
    ];
  
    const pageHitsData = [];
  
    let currentDate = startDate;
    while (currentDate <= endDate) {
      // Simulate random page hits for each course on different dates
      let numberOfEntries = Math.floor(Math.random() * 70+ Math.floor(pageHitsData.length/130)) + 2 ;
      while (numberOfEntries){
        const randomeIndex = Math.floor(Math.random() * 4) + 0; // Random number of hits (1-100)
        pageHitsData.push({
          courseId: courses[randomeIndex].courseId,
          courseName: courses[randomeIndex].courseName,
          date: currentDate.toISOString().split('T')[0],
        });
        numberOfEntries-=1;
      }
      
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return pageHitsData;
  }
  
  // Generate page hit data
  export const pageHitsData = generatePageHitsData();
  