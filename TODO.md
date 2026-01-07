# TODO: Implement Grade Entry with Marks and Auto-Calculated Grades

## Steps to Complete

1. **Update formData state**: Add `marks` object to store marks for each subject. ✅
2. **Add grading function**: Create a function to calculate grade based on marks (90-100: O, 80-89: A+, etc.). ✅
3. **Modify subjects table**: Add "Marks" input column and "Grade" display column in the upload tab. ✅
4. **Add marks validation**: Ensure marks are required, numeric, and between 0-100. ✅
5. **Update handleSubmit**: Calculate grades for each subject and save multiple grade entries (one per subject) to state and Firestore. ✅
6. **Update Manage Grades tab**: Display marks and grade per subject in the table. ✅
7. **Add filter by register number**: In Manage Grades tab, add input to filter grades by student regNo. ✅
8. **Add subject code field**: In Add Subject tab, add a subject code input field with validation. ✅
9. **Split code into components**: Refactor TeacherDashboard into separate components for better modularity. ✅
10. **Test the implementation**: Ensure marks input, grade calculation, saving, filtering, and subject code work correctly.
