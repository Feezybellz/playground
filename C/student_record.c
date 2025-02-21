#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define PASSING_THRESHOLD 40
#define FILENAME "student_records.txt"

typedef struct {
    char *name;
    int rollNumber;
    int marks;
} Student;

Student *students = NULL; // Dynamic array
int numStudents = 0;
int capacity = 10; // Initial capacity

// Function Prototypes
void welcomeMessage();
void resizeStudentsArray();
void addStudent();
void modifyStudent();
void deleteStudent();
void displayAllStudents();
void searchStudent();
void calculateAverage();
void sortStudentsAscending();
void sortStudentsDescending();
void saveToFile();
void loadFromFile();
void freeMemory();

int main() {
    students = (Student *)malloc(capacity * sizeof(Student));
    if (students == NULL) {
        perror("Memory allocation failed");
        exit(1);
    }

    welcomeMessage();
    loadFromFile();

    int choice;
    while (1) {
        printf("\n--- Student Record System ---\n");
        printf("1. Add Student\n2. Modify Student\n3. Delete Student\n4. Display Students\n");
        printf("5. Search Student\n6. Calculate Average Marks\n7. Sort Students (Ascending)\n");
        printf("8. Sort Students (Descending)\n9. Save to File\n10. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: addStudent(); break;
            case 2: modifyStudent(); break;
            case 3: deleteStudent(); break;
            case 4: displayAllStudents(); break;
            case 5: searchStudent(); break;
            case 6: calculateAverage(); break;
            case 7: sortStudentsAscending(); break;
            case 8: sortStudentsDescending(); break;
            case 9: saveToFile(); break;
            case 10:
                saveToFile();
                freeMemory();
                exit(0);
            default:
                printf("Invalid choice. Please try again.\n");
        }
    }
    return 0;
}

// Welcome message function
void welcomeMessage() {
    char userName[50];
    printf("Enter your name: ");
    scanf(" %[^\n]s", userName);
    printf("Welcome, %s, to the Student Record System!\n", userName);
}

// Function to resize array dynamically
void resizeStudentsArray() {
    capacity *= 2;
    students = realloc(students, capacity * sizeof(Student));
    if (students == NULL) {
        perror("Memory reallocation failed");
        exit(1);
    }
}

// Function to add a student
void addStudent() {
    if (numStudents >= capacity) {
        resizeStudentsArray();
    }

    students[numStudents].name = (char *)malloc(50 * sizeof(char));
    if (students[numStudents].name == NULL) {
        perror("Memory allocation failed");
        exit(1);
    }

    printf("Enter student name: ");
    scanf(" %[^\n]s", students[numStudents].name);
    printf("Enter roll number: ");
    scanf("%d", &students[numStudents].rollNumber);
    printf("Enter marks: ");
    scanf("%d", &students[numStudents].marks);

    printf("Student record added successfully.\n");
    numStudents++;
}

// Function to modify student records
void modifyStudent() {
    int rollNumber;
    printf("Enter roll number of student to modify: ");
    scanf("%d", &rollNumber);

    for (int i = 0; i < numStudents; i++) {
        if (students[i].rollNumber == rollNumber) {
            free(students[i].name);
            students[i].name = (char *)malloc(50 * sizeof(char));
            if (students[i].name == NULL) {
                perror("Memory allocation failed");
                exit(1);
            }
            printf("Enter new name: ");
            scanf(" %[^\n]s", students[i].name);
            printf("Enter new marks: ");
            scanf("%d", &students[i].marks);
            printf("Student record modified successfully.\n");
            return;
        }
    }
    printf("Student with roll number %d not found.\n", rollNumber);
}

// Function to delete a student
void deleteStudent() {
    int rollNumber, found = 0;
    printf("Enter roll number of student to delete: ");
    scanf("%d", &rollNumber);

    for (int i = 0; i < numStudents; i++) {
        if (students[i].rollNumber == rollNumber) {
            free(students[i].name);
            for (int j = i; j < numStudents - 1; j++) {
                students[j] = students[j + 1];
            }
            numStudents--;
            printf("Student record deleted successfully.\n");
            found = 1;
            break;
        }
    }
    if (!found) {
        printf("Student with roll number %d not found.\n", rollNumber);
    }
}

// Function to display all students
void displayAllStudents() {
    if (numStudents == 0) {
        printf("No student records available.\n");
        return;
    }
    printf("\nStudent Records:\n");
    for (int i = 0; i < numStudents; i++) {
        printf("Name: %s, Roll Number: %d, Marks: %d [%s]\n",
               students[i].name, students[i].rollNumber, students[i].marks,
               students[i].marks >= PASSING_THRESHOLD ? "Passed" : "Failed");
    }
}

// Function to search for a student
void searchStudent() {
    int rollNumber;
    printf("Enter roll number to search: ");
    scanf("%d", &rollNumber);

    for (int i = 0; i < numStudents; i++) {
        if (students[i].rollNumber == rollNumber) {
            printf("Student Found: %s, Marks: %d\n", students[i].name, students[i].marks);
            return;
        }
    }
    printf("Student with roll number %d not found.\n", rollNumber);
}

// Function to calculate average marks
void calculateAverage() {
    if (numStudents == 0) {
        printf("No students to calculate average.\n");
        return;
    }
    int totalMarks = 0;
    for (int i = 0; i < numStudents; i++) {
        totalMarks += students[i].marks;
    }
    printf("Average Marks: %.2f\n", (float)totalMarks / numStudents);
}

// Function to sort students by marks in ascending order
void sortStudentsAscending() {
    for (int i = 0; i < numStudents - 1; i++) {
        for (int j = i + 1; j < numStudents; j++) {
            if (students[i].marks > students[j].marks) {
                Student temp = students[i];
                students[i] = students[j];
                students[j] = temp;
            }
        }
    }
    printf("Students sorted in ascending order.\n");
}

// Function to sort students by marks in descending order
void sortStudentsDescending() {
    for (int i = 0; i < numStudents - 1; i++) {
        for (int j = i + 1; j < numStudents; j++) {
            if (students[i].marks < students[j].marks) {
                Student temp = students[i];
                students[i] = students[j];
                students[j] = temp;
            }
        }
    }
    printf("Students sorted in descending order.\n");
}

// Function to save records to a file
void saveToFile() {
    FILE *file = fopen(FILENAME, "w");
    if (file == NULL) {
        perror("Error opening file");
        return;
    }
    for (int i = 0; i < numStudents; i++) {
        fprintf(file, "%s,%d,%d\n", students[i].name, students[i].rollNumber, students[i].marks);
    }
    fclose(file);
}

// Function to load records from a file
void loadFromFile() {
    FILE *file = fopen(FILENAME, "r");
    if (file == NULL) return;

    while (numStudents < capacity && fscanf(file, "%[^,],%d,%d\n", students[numStudents].name, 
                  &students[numStudents].rollNumber, &students[numStudents].marks) == 3) {
        numStudents++;
    }
    fclose(file);
}

// Function to free allocated memory
void freeMemory() {
    for (int i = 0; i < numStudents; i++) {
        free(students[i].name);
    }
    free(students);
}

