const Student = require('../models/Student');
const ScholarshipType = require('../models/ScholarshipType');
const ScholarshipCriteria = require('../models/ScholarshipCriteria');
const Recommender = require('../models/Recommender');

// module.exports.recommendScholarships = async (req, res) => {
//     try {
//         const { studentId } = req.params;
        
       
//         const student = await Student.findById(studentId);
//         if (!student) {
//             return res.status(404).json({ error: 'Student not found' });
//         }
        
       
//         const scholarshipTypes = await ScholarshipType.find({});
        
      
//     for (const scholarship of scholarshipType.scholarships) {
//     let scholarshipScore = 0;
//     let matchedCriteria = [];

//    for (const scholarship of scholarshipType.scholarships) {
//     let scholarshipScore = 0;
//     let matchedCriteria = [];

//     let meetsAllCriteria = true; 

//     for (const criteria of scholarship.criteria) {
//         const studentProfileValue = student.myProfile.find(profile => profile.criteriaName === criteria.name)?.criteriaValue;
//         if (!studentProfileValue) {
          
//             meetsAllCriteria = false;
//             break; 
//         }
//         switch (criteria.valueType) {
//             case 'string':
//                 if (studentProfileValue === criteria.value) {
//                     scholarshipScore++;
//                     matchedCriteria.push(criteria._id);
//                 } else {
//                     meetsAllCriteria = false;
//                 }
//                 break;
//             case 'range':
//                 const [minRange, maxRange] = criteria.value.split(' - ').map(Number);
//                 const studentNumericValue = Number(studentProfileValue);
//                 if (!isNaN(studentNumericValue) && studentNumericValue >= minRange && studentNumericValue <= maxRange) {
//                     scholarshipScore++;
//                     matchedCriteria.push(criteria._id);
//                 } else {
//                     meetsAllCriteria = false;
//                 }
//                 break;
//             case 'number':
//                 if (Number(studentProfileValue) === Number(criteria.value)) {
//                     scholarshipScore++;
//                     matchedCriteria.push(criteria._id);
//                 } else {
//                     meetsAllCriteria = false;
//                 }
//                 break;
//             case 'boolean':
                
//                 break;
//             case 'date':
               
//                 break;
//             case 'enumerated':
                
//                 break;
//             case 'object':
                
//                 break;
//             default:
              
//                 break;
//         }

//         if (!meetsAllCriteria) {
//             break; 
//         }
//     }

//     if (meetsAllCriteria) {
        
//         score += scholarshipScore;
//         criteriaMatch.push(...matchedCriteria);
//     }
        
//         return res.json({ message: 'Scholarship recommendations generated successfully' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Failed to recommend scholarships' });
//     }
// };


const recommendController = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const student = await Student.findOne({ userId: studentId }).populate('userId');
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const scholarships = await ScholarshipType.find().populate('scholarships');

        let recommendations = scholarships.map((scholarshipType) => {
            return scholarshipType.scholarships.map((scholarship) => {
                let matchScore = 0;
                let totalCriteria = scholarship.criteria.length;
                
                for (let criterion of scholarship.criteria) {
                    const studentValue = student.myProfile[criterion.name];

                    if (studentValue === null || studentValue === undefined) {
                        matchScore += 0.5;  
                    } else if (studentValue === criterion.value) {
                        matchScore += 1;
                    } else if (studentValue < criterion.value && criterion.valueType === 'number') {
                        return null; 
                    }
                }

                return {
                    scholarship,
                    matchScore: (matchScore / totalCriteria) * 100
                };
            }).filter(Boolean);
        });

        recommendations = recommendations.flat().sort((a, b) => b.matchScore - a.matchScore);

        return res.status(200).json({ recommendations });
    } catch (error) {
        console.error("Error in recommending scholarships:", error);
        return res.status(500).json({ error: 'Error in recommending scholarships' });
    }
};

module.exports = { recommendController };
