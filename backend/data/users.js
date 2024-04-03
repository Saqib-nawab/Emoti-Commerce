import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin Saqib',
    email: 'saqib@gmail.com',
    password: bcrypt.hashSync('Skadoodle@01', 10),
    isAdmin: true,
  },
  // {
  //   name: 'John Doe',
  //   email: 'john@email.com',
  //   password: bcrypt.hashSync('123456', 10),
  // },
  // {
  //   name: 'Saqib Nawab',
  //   email: 'saqibnawab823@gmail.com',
  //   password: bcrypt.hashSync('123456', 10),
  // },
];

export default users;
