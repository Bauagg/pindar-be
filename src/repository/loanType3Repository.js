import pool from "../configuration/dbConfiguration.js";

export const updateLoanType = async (newJson) => {
  const jsonString = JSON.stringify(newJson);

  await pool.query(
    `INSERT INTO parameters (param_key, param_value)
     VALUES ('LOAN_TYPE_3', $1)
     ON CONFLICT (param_key)
     DO UPDATE SET param_value = EXCLUDED.param_value;`,
    [jsonString]
  );

  return true;
};

export const getLoanType3 = async () => {
  const result = await pool.query(
    "SELECT param_value FROM parameters WHERE param_key = 'LOAN_TYPE_3' LIMIT 1"
  );

  if (result.rows.length === 0) {
    return {};
  }

  return JSON.parse(result.rows[0].param_value);
};

export const updateLenderLoanType = async (lenderId, loanType) => {
  await pool.query(
    `UPDATE lender 
     SET loan_type = $1 
     WHERE id = $2`,
    [loanType, lenderId]
  );

  return true;
};
