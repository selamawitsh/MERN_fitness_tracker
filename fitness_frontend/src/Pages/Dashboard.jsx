import React from 'react'
import styled from 'styled-components'
import {counts} from '../assets/data.jsx'
import CountsCard from '../components/cards/CountsCard.jsx'
import WeeklyStat from '../components/cards/WeeklyStat.jsx'
import CategoryChart from '../components/cards/CategoryChart.jsx'
import AddWorkout from '../components/AddWorkout.jsx';
import { useState } from 'react';
import WorkoutCard from '../components/cards/WorkoutCard.jsx'


const Container = styled.div`
  flex: 1;
  height:100%;
  display:flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display:flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px){
  gap: 12px
  }
`;
const Title = styled.div`
  font-size: 22px;
  color: ${({theme}) => theme.text_primary}
  font-weight: 500;
`;
const FlexWrap = styled.div`
  display:flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px){
  gap: 12px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  @media (max-width: 600px){
    gap: 12px;
  }`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px){
    gap: 12px;
  }
  `;



function Dashboard() {
  const data = {
  totalCaloriesBurnt: 13500,
  totalWorkouts: 6,
  avgCaloriesBurntPerWorkout: 2250,

  totalWeeksCaloriesBurnt: {
    weeks: [
      "17th", "18th", "19th", "20th", "21st", "22nd", "23rd"
    ],
    caloriesBurned: [
      10500, 0, 0, 0, 0, 0, 13500
    ]
  },

  pieChartData: [
    {
      id: 0,
      value: 6000,
      label: "Legs"
    },
    {
      id: 1,
      value: 1500,
      label: "Back"
    },
    {
      id: 2,
      value: 3750,
      label: "Shoulder"
    },
    {
      id: 3,
      value: 2250,
      label: "ABS"
    }
  ]
};
const [workout, setworkout] = useState('')

  return (
    <Container>
        <Wrapper>
            <Title>DashBoard</Title>
              <FlexWrap>
                {counts.map((item)=>(
                  <CountsCard item={item} data={data}/>
                ))}
              </FlexWrap>

              <FlexWrap>
                <WeeklyStat data ={data}/>
                <CategoryChart data ={data}/>
                <AddWorkout workout={workout} setworkout={setworkout} />
              </FlexWrap>

              <Section>
                <Title>Todays Workouts</Title>
                <CardWrapper>
                  <WorkoutCard/>
                  <WorkoutCard/>
                  <WorkoutCard/>
                </CardWrapper>
              </Section>
        </Wrapper>
      
    </Container>
  )
}

export default Dashboard
