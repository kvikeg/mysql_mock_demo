//var fs = require('fs');
//var vm  = require('vm');
//var content = fs.readFileSync("./demo_service.js");
//eval(content);

const demo_service = require("./demo_service");

// This will be your global data variable
let _data = [
    { id: 1, name: 'User1' },
    { id: 2, name: 'User2' },
  ];
  
  jest.mock('mysql', () => ({
    createConnection: jest.fn(() => ({
      connect: jest.fn((callback) => callback(null)),
      query: jest.fn((sql, callback) => {
        console.log(`SQL Query: ${sql}`);
        callback(null, _data);
      }),
      end: jest.fn((callback) => callback(null)),
    })),
  }));

/*
jest.mock('mysql', () => ({
  createConnection: () => ({
    connect: (callback) => callback(null),
    query: (sql, callback) => {
      expect(sql).toBe('SELECT * from users;');
      callback(null, [
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' },
      ]);
    },
    end: (callback) => callback(null),
  }),
}));
*/
describe('Test database connection', () => {
  it('should connect and fetch users from the database', () => {
    
    // main of demo_service 
    demo_service.main_demo();

    //const con = mysql.createConnection({});
  });
});