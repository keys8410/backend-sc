const express = require('express');
const router = express.Router();
const mysql = require('../config/mysql');
const { verifySize, dataNormalized } = require('../helpers/helpers');

router.get('/', async (req, res) => {
  const query = ` SELECT 
                    gender
                  FROM
                    tb_gender
                  ORDER BY
                    gender
                  ASC`;

  try {
    const gender = await mysql.execute(query);
    if (verifySize(gender)) return res.jsonConflict(null);

    const response = {
      genders: gender.map(({ gender }) => {
        return {
          gender: gender,
          key: dataNormalized(gender),
        };
      }),
    };

    return res.jsonOK(response);
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(null);
  }
});

module.exports = router;
