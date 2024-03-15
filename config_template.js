/**
 * @file config_template.js
 * @description This file contains a template of configuration settings for the application.
 */

exports.config = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "username",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "db_name"
}

exports.jwtSecret = process.env.JWT_SECRET || "the_secret";

exports.tokens = {
    exampleAdminToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhbGljZTEyMyIsImZpcnN0X25hbWUiOiJBbGljZSIsImxhc3RfbmFtZSI6IlJvc2UiLCJlbWFpbCI6ImFsaWNlcm9zZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQyU25CaVlVN2gyeHIyT3lmNG9TdERPY1IzYlUuM0I2Z2JlUXJiZll2eEV3bnAwMHprTExBMiIsInBob25lX251bWJlciI6IjAxMjM0NTY3ODkwIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTVUMTI6MTY6NTYuMDAwWiIsInVwZGF0ZWRfYXQiOm51bGwsImlhdCI6MTcwODEwNTAxNCwiZXhwIjoxNzE2NzQ1MDE0fQ.FdOXn9Kj9S1ALeYxIJYNYjQhoK4SV-EViVJoeW3jlos",
    exampleUserToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InVzZXIiLCJ1c2VybmFtZSI6ImpvaG5zbWl0aCIsImZpcnN0X25hbWUiOiJKb2huIiwibGFzdF9uYW1lIjoiU21pdGgiLCJlbWFpbCI6ImpvaG5zbWl0aEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQwVkVSSXdvYkZGT1hVcWtFa3RrY211SUI5YllUWVhqUmpqczMvbmtqLjNYR1FRcjBUV3ZkdSIsInBob25lX251bWJlciI6IjA3NDI3ODM3NzM2IiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMTVUMTI6MDg6MjIuMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDI0LTAyLTE1VDE2OjUzOjMwLjAwMFoiLCJpYXQiOjE3MDgxMDc3NzIsImV4cCI6MTcxNjc0Nzc3Mn0.duLBACRhjhv8ApOJhcKih1tXp38gDAxIB4PDTa1mPQc"
}