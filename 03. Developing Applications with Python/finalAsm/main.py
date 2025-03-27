import sqlite3
from datetime import datetime
from tabulate import tabulate

conn = sqlite3.connect("medical_service.db")
cur = conn.cursor()

# Patients table
cur.execute("""
CREATE TABLE IF NOT EXISTS patients (
    patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL,
    address TEXT,
    phone_number TEXT,
    email TEXT
)
""")

# Doctors table
cur.execute("""
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    years_of_experience INTEGER
)
""")

# Appointments table
cur.execute("""
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_date TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
)
""")

conn.commit()

# Display menu
def showMenu():
    print('''
        ========== Medical Service ==========
        1. Add Patient
        2. Add Doctor
        3. Add Appointment
        4. Show Appointment Report
        5. Show All Patients
        6. Show All Doctors
        7. Exit
    ''')
    
    c = input('Please enter your choice: ')
    match (c):
        case '1':
            addPatient()
        case '2':
            addDoctor()
        case '3':
            addAppointment()
        case '4':
            showAllAppointments()
        case '5':
            showAllPatients()
        case '6':
            showAllDoctors()
        case '7':
            print('Closing program... Goodbye!')
            exit()
        case _:
            print('Invalid choice!')
            showMenu()

# Add patient from keyboard
def addPatient():
    print("Enter patient's information")
    name = input("Full name: ")
    
    while True:
        dob_input = input('Date of birth (DD-MM-YYYY): ')
        try:
            # Convert from dd-mm-yyyy to yyyy-mm-dd
            dob = datetime.strptime(dob_input, '%d-%m-%Y').strftime('%Y-%m-%d')
            break
        except ValueError:
            print("Invalid date format. Please enter as DD-MM-YYYY.")
            
    gender = input('Gender (Male/Female): ')
    address = input('Address: ')
    phone = input('Phone number: ')
    email = input('Email: ')
    
    cur.execute('''
        INSERT INTO patients (full_name, date_of_birth, gender, address, phone_number, email)
        VALUES (?, ?, ?, ?, ?, ?)''', (name, dob, gender, address, phone, email))
    conn.commit()
    print("Patient added successfully.\n")
    showMenu()
    
# Add doctor from keyboard
def addDoctor():
    print("Enter doctor's information")
    name = input("Full name: ")
    specialization = input('Specialization: ')
    phone = input('Phone number: ')
    email = input('Email: ')
    yoe = int(input('Years of experience: '))
    
    cur.execute('''
        INSERT INTO doctors (full_name, specialization, phone_number, email, years_of_experience)
        VALUES (?, ?, ?, ?, ?)''', (name, specialization, phone, email, yoe))
    conn.commit()
    print("Doctor added successfully.\n")
    showMenu()

# Add appointment from keyboard
def addAppointment():
    print("Enter appointment's information")
    patient = int(input("Enter patient's id: "))
    doctor = int(input("Enter doctor's id: "))
    while True:
        app_date_input = input('Appointment date (DD-MM-YYYY): ')
        try:
            # Convert from dd-mm-yyyy to yyyy-mm-dd
            app_date = datetime.strptime(app_date_input, '%d-%m-%Y').strftime('%Y-%m-%d')
            break
        except ValueError:
            print("Invalid date format. Please enter as DD-MM-YYYY.")
            
    reason = input('Reason: ')
    status = input('Status: ')
    
    cur.execute('''
        INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, status)
        VALUES (?, ?, ?, ?, ?)''', (patient, doctor, app_date, reason, status))
    conn.commit()
    print("Appointment added successfully.\n")
    showMenu()

# Show report for appointments
def showAllAppointments():
    print("\n=== REPORT: All Appointments with Patient and Doctor Info ===\n")
    cur.execute('''
        SELECT
            a.appointment_id,
            p.full_name AS patient_name,
            p.date_of_birth,
            p.gender,
            p.address,
            d.full_name AS doctor_name,
            a.reason,
            a.appointment_date
        FROM appointments AS a
        JOIN patients AS p ON a.patient_id = p.patient_id
        JOIN doctors AS d ON a.doctor_id = d.doctor_id
    ''')
    
    results = cur.fetchall()
    
    headers = ["No", "Appointment ID", "Patient Name", "Birthday", "Gender", "Address", "Doctor Name", "Reason", "Date"]
    table = []
    
    for i, row in enumerate(results, start=1):
        table.append([i, *row])
    
    print(tabulate(table, headers=headers, tablefmt="pretty"))
    print()
    showMenu()
    
# Show all patients in database
def showAllPatients():
    print("\n=== All Patients ===\n")
    cur.execute('SELECT * FROM patients')
    
    patients = cur.fetchall()
    
    headers = ["No", "Patient ID", "Full Name", "Birthday", "Gender", "Address", "Phone", "Email"]
    table = []
    
    for i, row in enumerate(patients, start=1):
        table.append([i, *row])
    
    print(tabulate(table, headers=headers, tablefmt="pretty"))
    print()
    showMenu()

# Show all doctors in database
def showAllDoctors():
    print("\n=== All Doctors ===\n")
    cur.execute('SELECT * FROM doctors')
    
    doctors = cur.fetchall()
    
    headers = ["No", "Patient ID", "Full Name", "Specialization", "Phone", "Email", "Years of Experience"]
    table = []
    
    for i, row in enumerate(doctors, start=1):
        table.append([i, *row])
    
    print(tabulate(table, headers=headers, tablefmt="pretty"))
    print()
    showMenu()

showMenu()