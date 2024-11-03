# Sprint 1 Release
### Format: [Short Description][User Story ID][Commit ID - Author]
**Feature Development:**

Created a basic front-end skeleton for the application [FUS-3], (741e2d1 - ntddat).

Integrated response handling from the front-end to the interpreter, connecting to Gemini prompting [FUS-3], (347fb44 - MinhNghiaVu).

Enabled communication between the front-end and Gemini API for seamless data exchange [FUS-3], (02b1ebf - ntddat).

Updated the generator page interface and added a navigation bar for improved user navigation [FUS-1], (a74ee2e - JiayingLu9).

Cleaned up prompt formats and created a JSON output parser for structured data handling [FUS-3], (bb94cbc - dohuyminh).

Updated background and interface components, aligning with UI Design 3.0 standards [NFUS-1], (3cdd5db - Mokkieee).

**Bug Fix:**

Modified component spacing to support different screen sizes, ensuring responsiveness across devices [NFUS-2], (a4c652f - Mokkieee).

Implemented warning messages for unauthorized users attempting to access the Admin page [FUS-6], (6431a6f - Mokkieee).

Standardized font size and formatting across pages to enhance readability and maintain UI consistency [NFUS-1], (8d1657a - Mokkieee).

Improved session handling on the front end to enhance the user experience and maintain session stability [FUS-3], (a4e37af - josephshim02).

Removed redundant CSV files (koala_data.csv) to streamline project structure [FUS-7], (be4baaa - ntddat).

# Sprint 2 Release
### Format: [Short Description][User Story ID][Commit ID - Author]
**New Features:**

Established MongoDB connection [FUS-7], (b0a87e3 - ErnestTayJieJun).

Completed linking server, parser, and const files together [FUS-7], (86dca9b - MinhNghiaVu).

Set the login credentials [FUS-6], (b7299b4 - Mokkieee).

Established connection in the server.js file, changed to use Mongoose [FUS-7], (43404ef - MinhNghiaVu).

Expanded and added validators to database models [FUS-7], (48fe2b0 - MinhNghiaVu).

Added cookie to admin [FUS-6], (0103b01 - PatheticCollegeLife).

Merged the history page with the web interface [FUS-5], (7c52f37 - JiayingLu9).

Implemented student summary page [FUS-7], (e085a23 - KyaLYU).

Set up router and controller [FUS-7], (23c3f07 - MinhNghiaVu).

Added the password visibility function in the Admin Login Page [FUS-6], (b141126 - Mokkieee).

Integrated the problem page and generator page with the backend server [FUS-3], (20b8b31 - JiayingLu9).

**Bug Fixes:**

Addressed the logout issue [FUS-6], (4a37e9a - JiayingLu9).

Solved the company name problem [FUS-2], (8aa20d9 - JiayingLu9).

Improved the drop-down function [NFUS-1], (de35819 - JiayingLu9).

Fixed bugs related to showing incorrect pages [NFUS-1], (ce03a58 - SHAWNCHEN014).

Integrated with the database [FUS-7], (0a4e4ea - ntddat).

Fixed the compiler [FUS-4], (5eb6dfa - yuhao8).

Fixed the layout problem [NFUS-1], (588a0c5 - Mokkieee).

Changed models to match the new database design [FUS-7], (5b7edc1 - MinhNghiaVu).

Fixed the logout bug [FUS-6], (f256ca0 - PatheticCollegeLife).

Solved the issue with the backend not receiving/defining data [FUS-7], (6cd261f - JiayingLu9).

Fixed the bug where code blocks could not be presented [FUS-3], (d67fc05 - JiayingLu9).

**UI/UX Enhancements:**

Introduced a new UI design for the generator page [NFUS-1], (dff894f - JiayingLu9).

Unified navigation bar format [NFUS-1], (c70991b - JiayingLu9).

Unified fonts and ensured consistent style across all pages [NFUS-1], (f0f7e36 - JiayingLu9).

Added the Enter key to simulate the login function and adjusted the layout [FUS-6], (d5a1e7f - Mokkieee).

Updated the problem-solving page [FUS-4], (5108d7d - SeeleVollerie).

Added a sliding list to the Admin Profile [FUS-7], (cb52410 - SHAWNCHEN014).

Unified fonts on all pages [NFUS-1], (f0f7e36 - JiayingLu9).

Added a Home button to the Problem page [NFUS-1], (f5c36e9 - JiayingLu9).

Added true and false images [FUS-4], (961cfd0 - JiayingLu9).

Adjusted layouts and improved the appearance of various components [NFUS-1], (8daeb86 - SHAWNCHEN014).

# Sprint 3 Release
### Format: [Short Description][User Story ID][Commit ID - Author]
**Backend integrations:**

Completed the database connection and optimized the database model [FUS-5], (5b7edc1, 43404ef -MinhNghiaVu)

Created the API for sending student history data and summmay of performanc to frontend [FUS-7], (02b1ebf -ntddat)

**New functions:**

Added new features to the admin dashboard to display student performance, including completed questions, accuracy, and time spent on each topic. Added a bar chart to show the total correct answers by students for each topic [FUS-7],(e085a23,b73d20f -KyaLiu)

Admins can sort students based on student ID, questions, and accuracy [FUS-7],(b73d20f -kyaLiu)

**UI/UX Echancements:**

Unify fonts on all pages, navigation bar format [NFUS-4], (f0f7e36 -JiayingLu9, c70991b -JiayingLu9, 6622698 f7eb16c -JiayingLu9)

Updated the question page and history page [NFUS-4], (1b2741f -SeeleVollerle, 6ffb71d -PatheticCollegeLife)

Changed the color of code blocks based on results, enhancing the intuitiveness of the user interface [NFUS-4], (872e900 -SeeleVollerie)

**Bugfix:**

Fixed issues with the timer refresh [FUS-5], (451c440 -dohuyminh, 09b5635 yuhao8, ce69a05 -yuhaokevinliu)

Resolved several issues during the code generation process to ensure questions can be generated correctly and displayed to users [FUS-4] [FUS-3], (d307326 -ntddat)

Addressed potential length issues with code blocks after regeneration, ensuring correct display of code blocks [FUS-4], (526e8a6 -josephshim02)

Ensured that answers to questions are not exposed in network tabs through backend encoding [NFUS-3], (b088752, ntddat)
