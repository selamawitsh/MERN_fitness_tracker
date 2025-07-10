import { BarChart } from '@mui/x-charts'; // ✅ Real chart import
import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 25px;
  border: 1px solid ${({theme})=> theme.text_primary};
  border-radius: 14px;
  box-shadow: 1px 2px 10px 0px ${({theme})=> theme.text_primary};
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media(max-width: 600px){
    padding: 16px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({theme}) => theme.primary};

  @media (max-width: 600px){
    font-size: 14px;
  }
`;

function WeeklyStat({data}) {
  return (
    <Card>
      <Title>Weekly Calories Burned</Title>
      {data?.totalWeeksCaloriesBurnt && 
        <BarChart
          xAxis={[{ scaleType: "band", data: data.totalWeeksCaloriesBurnt.weeks }]}
          series={[{ data: data.totalWeeksCaloriesBurnt.caloriesBurned }]}
          height={300}
        />
      }
    </Card>
  );
}

export default WeeklyStat;
