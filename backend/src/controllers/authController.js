// javascript
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Registering user:", { name, email, password });

    // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
    // ตรวจสอบว่า email นี้มีอยู่ในระบบแล้วหรือยัง
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // เข้ารหัส password ก่อนบันทึกลงฐานข้อมูล
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่ในฐานข้อมูล
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    // ตรวจสอบว่ามีการส่งข้อมูล email และ password หรือไม่
    if(!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    } 

 // ค้นหาผู้ใช้ในฐานข้อมูล
    console.log('Searching for user with email:', email);
    const user = await prisma.user.findUnique({ where: { email } });

    //ถ้าไม่พบผู้ใช้
   if(!user){
    return res.status(401).json({
      message: 'Email is incorrect Please try again.'
    })
   }
    // ตรวจสอบรหัสผ่าน
   const isPasswordValid = await bcrypt.compare(password, user.password);
   if(!isPasswordValid) {
    return res.status(401).json({
      message: 'Password is incorrect Please try again.'
    });
   }
    // สร้าง JWT token สำหรับผู้ใช้
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      // ส่ง response กลับไปพร้อม token และข้อมูลผู้ใช้
    res.json({
      message: 'Login success',
      data: { id: user.id, name: user.name, email: user.email },
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
