import React, { useState } from 'react';
import { Input, Button, Form, InputNumber, Row, Col, Divider, message } from 'antd';
import copy from 'copy-to-clipboard';
import styles from './index.module.css';

function Calculator() {
  const DEFAULT_PERIOD = new Date().getMonth();
  const DEFAULT_SALARY = 8748.11;
  let insurance = 655.33;
  let afterTaxSalary = 8000;
  const [periodSalary, setPeriodSalary] = useState(Array.from({ length: DEFAULT_PERIOD - 1 }).fill(DEFAULT_SALARY));
  const [result, setResult] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultPeriod, setResultPeriod] = useState(DEFAULT_PERIOD);

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
        <Col xs={12} sm={8} key={index}>
          <Form.Item label={`${index + 1}月`}>
            <Input
              defaultValue={salary}
              onChange={e => salaryOnChange(e, index)}
              onFocus={e => e.target.select()}
              allowClear
            />
          </Form.Item>
        </Col>
      );
    });
  }

  function periodOnChange(nextPeriod) {
    if (nextPeriod > 12 || nextPeriod < 1) {
      return;
    }
    nextPeriod = Number(nextPeriod);
    const currPeriod = periodSalary.length + 1;
    let nextPeriodSalary = [];

    if (nextPeriod > currPeriod) {
      const initSalary = periodSalary.length === 0 ? DEFAULT_SALARY : periodSalary[periodSalary.length - 1];
      nextPeriodSalary = [...periodSalary, ...Array.from({ length: nextPeriod - currPeriod }).fill(initSalary)];
    } else {
      nextPeriodSalary = periodSalary.slice(0, nextPeriod - 1);
    }
    setPeriodSalary([...nextPeriodSalary]);
  }

  function salaryOnChange(e, index) {
    periodSalary[index] = Number(e.target.value);
  }

  function calculatePrevTax(periodSalary, insurance) {
    const rates = [0.03, 0.1, 0.2, 0.25, 0.3, 0.35, 0.45];
    const deductions = [0, 2520, 16920, 31920, 52920, 85920, 181920];
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
    const d = deductions[index];
    return Number(((p - b) * r - d).toFixed(2));
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

    setResultPeriod(periodSalary.length + 1);

    setIsCalculating(false);
  }

  function calculate(afterTaxSalary, periodSalary, insurance) {
    setIsCalculating(true);
    window.requestIdleCallback(() => calculateCostly(afterTaxSalary, periodSalary, insurance));
  }

  function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
  }

  function onCopy() {
    copy(result);
    message.success('复制成功');
  }

  return (
    <div className={styles.app}>
      <Form {...formItemLayout} className={styles.form}>
        <Form.Item label={`${periodSalary.length + 1}月税后工资：`} wrapperCol={{ sm: 6 }}>
          <Input
            defaultValue={afterTaxSalary}
            onChange={e => (afterTaxSalary = Number(e.target.value))}
            onFocus={e => e.target.select()}
            allowClear
          />
        </Form.Item>
        <Form.Item label="期数：" wrapperCol={{ sm: 6 }}>
          <InputNumber
            min={1}
            max={12}
            defaultValue={DEFAULT_PERIOD}
            onChange={periodOnChange}
            onFocus={e => e.target.select()}
          />
        </Form.Item>
        <Form.Item label="各项社会保险费：" wrapperCol={{ sm: 6 }}>
          <Input
            defaultValue={insurance}
            onChange={e => (insurance = Number(e.target.value))}
            onFocus={e => e.target.select()}
            allowClear
          />
        </Form.Item>
        <Divider dashed={true} />
        <Row type="flex" justify="start">
          {renderPeriodInputs()}
        </Row>
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
          <Form.Item label={`${resultPeriod}月税前工资：`} {...formItemLayout}>
            <span>{result}</span>
            <Button type="link" onClick={onCopy}>
              复制
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
}

export default Calculator;
