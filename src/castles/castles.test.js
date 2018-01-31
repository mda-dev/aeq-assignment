/* eslint-disable */
import {buildCastles} from './castles'

it('should return correct ammount of castles', () => {
    // modify array below to test
    const testLandscape = [1, 2, 3, 2, 4, 3, 4, null, false, 'string', undefined, 1]
    // set correct answer below
    const expectedResult = 7
    expect(buildCastles(testLandscape)).toEqual(expectedResult)
})
