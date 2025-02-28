#include <iostream>
#include <vector>
#include <algorithm>
#include <fstream>

using namespace std;

// Structure to store student information
struct Student {
    string name;
    int rollNumber;
    float marks;
};

// Function prototypes
void addStudent(vector<Student> &students);
void displayStudents(const vector<Student> &students);
void modifyStudent(vector<Student> &students);
void deleteStudent(vector<Student> &students);
void searchStudent(const vector<Student> &students);
void saveToFile(const vector<Student> &students);
void loadFromFile(vector<Student> &students);
void sortStudentsAscending(vector<Student> &students);
void sortStudentsDescending(vector<Student> &students);
void calculateAverageMarks(const vector<Student> &students);

int main() {
    vector<Student> students;
    int choice;
    
    cout << "Welcome to Student Management System!\n";

    while (true) {
        cout << "\nMenu:\n";
        cout << "1. Add Student\n";
        cout << "2. Display Students\n";
        cout << "3. Modify Student\n";
        cout << "4. Delete Student\n";
        cout << "5. Search Student\n";
        cout << "6. Save to File\n";
        cout << "7. Load from File\n";
        cout << "8. Sort Students Ascending\n";
        cout << "9. Sort Students Descending\n";
        cout << "10. Calculate Average Marks\n";
        cout << "11. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1: addStudent(students); break;
            case 2: displayStudents(students); break;
            case 3: modifyStudent(students); break;
            case 4: deleteStudent(students); break;
            case 5: searchStudent(students); break;
            case 6: saveToFile(students); break;
            case 7: loadFromFile(students); break;
            case 8: sortStudentsAscending(students); break;
            case 9: sortStudentsDescending(students); break;
            case 10: calculateAverageMarks(students); break;
            case 11: cout << "Exiting program...\n"; return 0;
            default: cout << "Invalid choice. Try again.\n";
        }
    }
}

// Function to check if a roll number already exists
bool rollNumberExists(const vector<Student> &students, int rollNumber) {
    for (const auto &student : students) {
        if (student.rollNumber == rollNumber) {
            return true;  // Roll number already exists
        }
    }
    return false;  // Roll number is unique
}

// Function to add a student
void addStudent(vector<Student> &students) {
    Student s;
    
    cout << "Enter name: ";
    cin.ignore();
    getline(cin, s.name);

    // Ensure unique roll number
    while (true) {
        cout << "Enter roll number: ";
        if (!(cin >> s.rollNumber)) {
            cout << "Invalid input! Enter a valid roll number: ";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            continue;
        }

        if (rollNumberExists(students, s.rollNumber)) {
            cout << "Roll number already exists! Enter a different roll number.\n";
        } else {
            break;  // Unique roll number found
        }
    }

    cout << "Enter marks: ";
    while (!(cin >> s.marks)) {
        cout << "Invalid input! Enter valid marks: ";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    students.push_back(s);
    cout << "Student added successfully!\n";
}

// Function to display all students
void displayStudents(const vector<Student> &students) {
    if (students.empty()) {
        cout << "No student records available.\n";
        return;
    }
    cout << "\nStudent Records:\n";
    for (const auto &s : students) {
        cout << "Name: " << s.name << ", Roll No: " << s.rollNumber << ", Marks: " << s.marks << endl;
    }
}

// Function to modify a student record
void modifyStudent(vector<Student> &students) {
    int roll;
    cout << "Enter roll number to modify: ";
    while (!(cin >> roll)) {
        cout << "Invalid input! Enter a valid roll number: ";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    if (!rollNumberExists(students, roll)) {
        cout << "Student not found.\n";
        return;
    }

    for (auto &s : students) {
        if (s.rollNumber == roll) {
            cout << "Enter new name: ";
            cin.ignore();
            getline(cin, s.name);

            cout << "Enter new marks: ";
            while (!(cin >> s.marks)) {
                cout << "Invalid input! Enter valid marks: ";
                cin.clear();
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
            }

            cout << "Record updated successfully!\n";
            return;
        }
    }
}



// Function to delete a student record
void deleteStudent(vector<Student> &students) {
    int roll;
    cout << "Enter roll number to delete: ";
    cin >> roll;
    for (auto it = students.begin(); it != students.end(); ++it) {
        if (it->rollNumber == roll) {
            students.erase(it);
            cout << "Record deleted.\n";
            return;
        }
    }
    cout << "Student not found.\n";
}

// Function to search for a student
void searchStudent(const vector<Student> &students) {
    int roll;
    cout << "Enter roll number to search: ";
    cin >> roll;
    for (const auto &s : students) {
        if (s.rollNumber == roll) {
            cout << "Name: " << s.name << ", Roll No: " << s.rollNumber << ", Marks: " << s.marks << endl;
            return;
        }
    }
    cout << "Student not found.\n";
}

// Function to save student records to a file
void saveToFile(const vector<Student> &students) {
    ofstream file("students.txt");
    for (const auto &s : students) {
        file << s.name << " " << s.rollNumber << " " << s.marks << endl;
    }
    file.close();
    cout << "Records saved to file.\n";
}

// Function to load student records from a file
void loadFromFile(vector<Student> &students) {
    ifstream file("students.txt");
    if (!file) {
        cout << "No saved records found.\n";
        return;
    }
    students.clear();
    Student s;
    while (file >> s.name >> s.rollNumber >> s.marks) {
        students.push_back(s);
    }
    file.close();
    cout << "Records loaded from file.\n";
}

// Function to sort students by marks in ascending order
void sortStudentsAscending(vector<Student> &students) {
    sort(students.begin(), students.end(), [](const Student &a, const Student &b) {
        return a.marks < b.marks;
    });
    cout << "Students sorted in ascending order.\n";
}

// Function to sort students by marks in descending order
void sortStudentsDescending(vector<Student> &students) {
    sort(students.begin(), students.end(), [](const Student &a, const Student &b) {
        return a.marks > b.marks;
    });
    cout << "Students sorted in descending order.\n";
}

// Function to calculate the average marks of students
void calculateAverageMarks(const vector<Student> &students) {
    if (students.empty()) {
        cout << "No student records available.\n";
        return;
    }
    float sum = 0;
    for (const auto &s : students) {
        sum += s.marks;
    }
    cout << "Average Marks: " << sum / students.size() << endl;
}

