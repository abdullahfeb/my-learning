//course information
const courses = [
    {
        id: 1,
        title: "Complete JavaScript Guide 2026",
        instructor: "Dr. Angela Yu",
        price: "৳1,199",
        image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500",
        rating: 4.8,
        students: 156000,
        duration: "40 hours",
        level: "Beginner",
        category: "Programming"
    },
    {
        id: 2,
        title: "Mastering React & Redux",
        instructor: "Stephen Grider",
        price: "৳1,399",
        image: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=500",
        rating: 4.7,
        students: 98000,
        duration: "35 hours",
        level: "Intermediate",
        category: "Programming"
    },
    {
        id: 3,
        title: "UI/UX Design Essentials",
        instructor: "Daniel Scott",
        price: "৳999",
        image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=500",
        rating: 4.6,
        students: 45000,
        duration: "28 hours",
        level: "Beginner",
        category: "Design"
    },
    {
        id: 4,
        title: "Python for Data Science",
        instructor: "Jose Portilla",
        price: "৳1,499",
        image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=500",
        rating: 4.9,
        students: 203000,
        duration: "45 hours",
        level: "Intermediate",
        category: "Data Science"
    },
    {
        id: 5,
        title: "Modern HTML & CSS From The Beginning",
        instructor: "Brad Traversy",
        price: "Free",
        image: "https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&w=500",
        rating: 4.7,
        students: 312000,
        duration: "22 hours",
        level: "Beginner",
        category: "Web Design"
    },
    {
        id: 6,
        title: "Fullstack Node.js Masterclass",
        instructor: "Mosh Hamedani",
        price: "৳1,899",
        image: "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=500",
        rating: 4.8,
        students: 76000,
        duration: "50 hours",
        level: "Advanced",
        category: "Programming"
    }
];

const courseGrid = document.getElementById('courseGrid');
const searchBar = document.getElementById('searchBar');
let enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];

//gnerating stars for rating
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '&#9733;'; // Full star code
        } else if (i === fullStars && hasHalfStar) {
            stars += '&#9734;'; // Half star code
        } else {
            stars += '&#9734;'; // Empty star code
        }
    }
    return stars;
}

//student count
function formatStudents(count) {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(0) + 'k';
    return count;
}

function renderCourses(filteredList) {
    courseGrid.innerHTML = "";

    if (filteredList.length === 0) {
        courseGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px; font-size: 1.1rem;">No courses found. Try different keywords!</p>`;
        return;
    }

    filteredList.forEach(course => {
        const isEnrolled = enrolledCourses.includes(course.id);
        const card = document.createElement('div');
        card.className = 'course-card';
        
        card.innerHTML = `
            <img src="${course.image}" 
                 alt="${course.title}" 
                 onerror="this.src='https://via.placeholder.com/500x300?text=Course+Image'"
                 style="width: 100%; height: 160px; object-fit: cover;">
            <div class="course-info">
                <h3>${course.title}</h3>
                <p class="instructor">${course.instructor}</p>
                <span class="price">${course.price}</span>
            </div>
            <button class="enroll-btn" onclick="enroll(${course.id})">Enroll Now</button>
        `;
        courseGrid.appendChild(card);
    });
}

// Reactive Search with debounce
let searchTimeout;
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) || 
        course.instructor.toLowerCase().includes(searchTerm)
    );
    displayCourses(filtered);
});

function enroll(id) {
    const course = courses.find(c => c.id === id);
    
    if (enrolledCourses.includes(id)) {
        enrolledCourses = enrolledCourses.filter(cid => cid !== id);
        alert(`Unenrolled from: ${course.title}`);
    } else {
        enrolledCourses.push(id);
        alert(`Successfully enrolled in:\n\n${course.title}\n\nInstructor: ${course.instructor}`);
    }
    
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    renderCourses(courses);
}

//smooth page load animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

renderCourses(courses);