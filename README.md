# COMP30022-IT-Project-Parsons-Problem-Teams-2-4-6
A Parsons Problem Generation Website made in collaboration between Teams 2, 4, and 6 for IT Project (COMP30022) in Semester 2, 2024 for client Geela Chee. Website is intended to improve the programming skills of students, specifically in data analysis and machine learning using Python tools and libraries.

## Getting Started
### Pre-requisites
- Node.js (https://github.com/amplication/amplication/blob/master/README.md)
- Git (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Cloning
```sh
git clone https://github.com/MinhNghiaVu/IT-Project-Parsons-Problem-Teams-2-4-6.git
```

### Setting up the .env file
Copy and paste the contents of the .env file (not uploaded here) into a file named `.env` in your project folder

### Python libraries
Install necessary Python files to work with Python interpreter
NumPy: https://numpy.org/install/
Scikit-learn: https://scikit-learn.org/stable/install.html
NLTK: https://www.nltk.org/install.html
Pandas: https://pandas.pydata.org/docs/getting_started/install.html

### NLTK Modules
Many of the code snippets generated by Gemini uses specific nltk modules, but don’t contain the line of code needed to install them (e.g. nltk.download('punkt')). To remedy this, before running the server, we need to pre-install these modules so the Python compiler won’t be confused on what they are.

Paste the following lines into a Python script and run it (using python `<name>.py` or `python3 <name>.py` depending on your system)

```
import nltk
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('wordnet')
nltk.download('stopwords')
nltk.download('words')
```

### Running on local machine
After the repository is cloned to your local machine and ensuring that you have Node.js installed, run the following commands in order in your terminal.
```
npm install    # installs all necessary libraries and dependencies for the project
npm run build  # building the project
npm run dev    # running and creating a server for the website
```
When all commands are run, if nothing has gone wrong, a localhost link should be displayed on the terminal. Ctrl+LeftClick on the link or copy and paste it into your preferred browser to access the website.

# Features
## Parson's Problems with different Topics and Contexts, generated by Google's Gemini AI
## Checking correctness of User's Submissions
## Viewing your own Analytics and Performance (if cookies are accepted)
## (ADMIN ONLY) Viewing users' overall analytics and performances
