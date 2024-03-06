// This test fails because 1 !== 2
it('Testing to see if Jest works', () => {
	expect(1).toBe(1)
})

test('Jest should use the test DB', ()=> {
	expect(process.env.DB_DATABASE).toBe('6003_CW_tests');
  })
  