export const DataGitCommandsHighlight = {
    word: ['Git', 'GitLab CE', 'Community Edition', 'Server', 'Repository', 'Remote', 'Branch', 'Source', 'Code', 'Local', 'Commit']
}

export const DataGitCommandsDesc = {
    text: `&emsp;Git ที่ใช้ปัจจุบันเป็น GitLab CE หรือ Community Edition ซึ่งติดตั้งบน Server ภายใน โดยใช้ URL: http://10.0.0.31 เพื่อเข้าเข้าสู่ระบบ Git และสร้าง Repository`,
}

// export const DataGitCommitDesc = {
//     text: `&emsp;Git `,
// }

// export const DataGitCommandsUsed = [
//     { text: `&emsp;<kbd>git clone {REMOTE_URL}</kbd> &#8594; เป็นการดึง Source Code จาก Remote ลง Local --ตัวอย่าง <kbd>git clone http://10.0.0.31/IT-Special-Project/REACT-Template.git</kbd>`, },
//     { text: `&emsp;<kbd>git branch</kbd> &#8594; เป็นการเช็ค Branch ภายใน Local`, },
//     { text: `&emsp;<kbd>git branch {BRANCH_NAME}</kbd> &#8594; เป็นการสร้าง Branch ใหม่ ภายใน Local --ตัวอย่าง <kbd>git branch features/test</kbd>`, },
//     { text: `&emsp;<kbd>git branch -D {BRANCH_NAME}</kbd> &#8594; เป็นการลบ Branch ภายใน Local --ตัวอย่าง <kbd>git branch -D features/test</kbd>`, },
//     { text: `&emsp;<kbd>git checkout {BRANCH_NAME}</kbd> &#8594; เป็นการดึง Branch จาก Remote ลง Local --ตัวอย่าง <kbd>git checkout features/dev</kbd>`, },
//     { text: `&emsp;<kbd>git switch {BRANCH_NAME}</kbd> &#8594; เป็นการสลับ Branch ภายใน Local --ตัวอย่าง <kbd>git switch features/pre</kbd>`, },
//     { text: `&emsp;<kbd>git fetch</kbd> &#8594; เป็นการเช็คความเปลี่ยนแปลงบน Remote ล่าสุด`, },
//     { text: `&emsp;<kbd>git pull</kbd> &#8594; เป็นการดึง Source Code จาก Remote ล่าสุด ลง Local`, },
//     { text: `&emsp;<kbd>git stash</kbd> &#8594; เป็นการซ่อนความเปลี่ยนแปลง ภายใน Local`, },
//     { text: `&emsp;<kbd>git commit -am "ข้อความ"</kbd> &#8594; เป็นการ Commit Source Code ภายใน Local`, },
//     { text: `&emsp;<kbd>git push {REMOTE_NAME} {BRANCH_NAME}</kbd> &#8594; เป็นการอัปโหลด Source Code หรือ Branch ขึ้นบน Remote --ตัวอย่าง <kbd>git push origin features/test</kbd>`, },
//     { text: `&emsp;<kbd>git push origin --delete {BRANCH_NAME}</kbd> &#8594; เป็นการลบ Branch บน Remote --ตัวอย่าง <kbd>git push origin --delete features/test</kbd>`, },
// ]

export const DataGitCommitUsed = [
    { text: `&emsp;<kbd>git branch</kbd> เป็นการเช็ค Branch ภายใน Local`, },
    { text: `&emsp;<kbd>git add .</kbd>  or <kbd>  git add index.html</kbd>  เป็นการเพิ่มไฟล์ทั้งหมดหรือไฟล์ที่ต้องการ Commit  --ตัวอย่าง <kbd>git add index.html about.html</kbd>`, },
    { text: `&emsp;<kbd>git status</kbd>  เป็นการเช็คไฟล์ที่ต้องการ Commit `, },
    { text: `&emsp;<kbd>git commit -m "..."</kbd> เป็นการใส่ข้อความในการ Comiit --ตัวอย่าง <kbd>git commit -m "first commit"</kbd>`, },
    { text: `&emsp;<kbd>git push</kbd> เป็นการอัปโหลด Source Code หรือ Branch ขึ้นบน local</kbd>`, },
    { text: `&emsp;<kbd>git push origin</kbd> เป็นการอัปโหลด Source Code หรือ Branch ขึ้นบน Remote</kbd>`, },

    { text: `&emsp;______________________________________________________________________________________`, },
    { text: `&emsp;<kbd>git reset --hard HEAD~1</kbd> คำสั่งลบสิ่งที่เคย commit ออกไปเลย กลับไปยัง commit ก่อนหน้า</kbd>`, },
    { text: `&emsp;<kbd>git push --force</kbd> คำสั่งลบสิ่งที่เคย commit ออกไปแล้ว บน Remote ใช้หลังจาก <kbd>git reset --hard HEAD~1</kbd> </kbd>`, },
    { text: `&emsp;<kbd>git reset</kbd> คำสั่งยกเลิกเมื่อเราสั่ง git add ไปแล้ว</kbd>`, },
    { text: `&emsp;<kbd>git restore .</kbd> คำสั่งลบสิ่งที่แก้ไขทั้งหมด --ตัวอย่าง git restore src/modules/gitCommits/DataDocs.js</kbd>`, },
    { text: `&emsp;<kbd>git diff</kbd> คำสั่งดูว่า Code มีอะไรเปลี่ยนแปลงและแตกต่างไปบ้าง</kbd>`, },
    { text: `&emsp;<kbd>git stash</kbd> คำสั่งเพื่อซ่อนการเปลี่ยนแปลง</kbd>`, },
    { text: `&emsp;<kbd>git stash list</kbd> คำสั่งดูโค้ดที่ซ่อน</kbd>`, },
    { text: `&emsp;<kbd>git stash pop</kbd> คำสั่งนำ Code ที่ซ่อนไว้กลับมาทำต่อ</kbd>`, },
    { text: `&emsp;<kbd>git branch -D {branch_name}</kbd> คำสั่งเพื่อลบ Branch บน local</kbd>`, },
    { text: `&emsp;<kbd>git push origin --delete {branch_name}</kbd> คำสั่งเพื่อลบ Branch บน Git Remote</kbd>`, },
    { text: `&emsp;<kbd>git push -u origin {branch}</kbd> คำสั่งเพื่อเพิ่ม Branch บน Git Remote</kbd>`, },
    { text: `&emsp;<kbd>git name-rev --name-only {commit-id}</kbd> คำสั่งเพื่อดู Branch ที่ Commit id นี้</kbd>`, },
]

export const DataGitCommandsLearn = [
    { text: `&emsp;Git Reference &#8594; https://git-scm.com/docs` },
    { text: `&emsp;คำสั่ง Git ที่ใช้งานบ่อย &#8594; https://memo8.com/git-basic-command/` },
]