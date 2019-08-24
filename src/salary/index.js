import React, { useState } from 'react';
import { Input, Button, Form, InputNumber } from 'antd';
import styles from './index.module.css';

function Calculator() {
  const [periodSalary, setPeriodSalary] = useState([]);
  const [result, setResult] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  let insurance = 655.33;
  let afterTaxSalary = 8000;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  function renderPeriodInputs() {
    return periodSalary.map((salary, index) => {
      return (
        <Form.Item label={`${index + 1}月`} key={index}>
          <Input defaultValue={salary} onChange={e => salaryOnChange(e, index)} />
        </Form.Item>
      );
    });
  }

  function periodOnChange(nextPeriod) {
    nextPeriod = Number(nextPeriod);
    const currPeriod = periodSalary.length + 1;
    let nextPeriodSalary = [];

    if (nextPeriod > currPeriod) {
      nextPeriodSalary = [...periodSalary, ...Array.from({ length: nextPeriod - currPeriod }).fill(8748.11)];
    } else {
      nextPeriodSalary = periodSalary.slice(0, nextPeriod - 1);
    }
    setPeriodSalary([...nextPeriodSalary]);
  }

  function salaryOnChange(e, index) {
    periodSalary[index] = e.target.value;
  }

  function calculatePrevTax(periodSalary, insurance) {
    const rates = [0.03, 0.1, 0.2, 0.25, 0.3, 0.35, 0.45];
    const range = [36000, 144000, 300000, 420000, 660000, 960000];
    const period = periodSalary.length;
    if (period === 0) {
      return 0;
    }
    const i = insurance;
    const b = (5000 + i) * period;
    const p = sum(periodSalary);
    const y = p - b;
    let index = 0;
    for (let i = 0; i < range.length; i++) {
      if (y < range[i]) {
        index = i;
        break;
      } else {
        index = i + 1;
      }
    }

    const r = rates[index];
    return Number(((p - b) * r).toFixed(2));
  }

  function calculateCostly(afterTaxSalary, periodSalary, insurance) {
    const rates = [0.03, 0.1, 0.2, 0.25, 0.3, 0.35, 0.45];
    const deductions = [0, 2520, 16920, 31920, 52920, 85920, 181920];
    const range = [36000, 144000, 300000, 420000, 660000, 960000];
    const period = periodSalary.length + 1;

    let index = 0;

    const i = insurance;
    const b = (5000 + i) * period;
    const p = sum(periodSalary);
    const a = afterTaxSalary;
    const y = p - b + a;

    for (let i = 0; i < range.length; i++) {
      if (y < range[i]) {
        index = i;
        break;
      } else {
        index = i + 1;
      }
    }

    const r = rates[index];
    const d = deductions[index];
    const t = calculatePrevTax(periodSalary, insurance);

    const x = ((a + i - d - t - r * (b - p)) / (1 - r)).toFixed(2);

    setResult(x);

    setIsCalculating(false);
  }

  function calculate(afterTaxSalary, periodSalary, insurance) {
    setIsCalculating(true);
    window.requestIdleCallback(() => calculateCostly(afterTaxSalary, periodSalary, insurance));
  }

  function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
  }

  return (
    <div className={styles.app}>
      <Form {...formItemLayout} className={styles.form}>
        <Form.Item label="税后工资：">
          <Input defaultValue={afterTaxSalary} onChange={e => (afterTaxSalary = Number(e.target.value))} />
        </Form.Item>
        <Form.Item label="期数：">
          <InputNumber min={1} max={12} defaultValue={1} onChange={periodOnChange} />
        </Form.Item>
        <Form.Item label="各项社会保险费：">
          <Input defaultValue={insurance} onChange={e => (insurance = Number(e.target.value))} />
        </Form.Item>
        {renderPeriodInputs()}
        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            onClick={() => calculate(afterTaxSalary, periodSalary, insurance)}
            loading={isCalculating}
          >
            计算
          </Button>
        </Form.Item>
        {!!result && (
          <Form.Item label="本月税前工资：" {...formItemLayout}>
            <span>{result}</span>
          </Form.Item>
        )}
      </Form>
    </div>
  );
}

export default Calculator;
