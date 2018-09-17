/**
 * Returns range from [-max, max]
 * @param max
 * @param min
 * @returns {number}
 */
const generateRandomNumber = (max = 30, min = 2) => {
  return (Math.random() < 0.5 ? -1 : 1) *  Math.floor(Math.random() * (max - min + 1)) + min;
};

class Railway {
  constructor(data) {
    this.railwaysData = data;
    this.iterationTime = 2000;
  }

  runIntervalIteration() {
    const { railwaysData } = this;

    railwaysData.forEach(item => this.returnTrainNextStation(item));
    railwaysData.forEach(item => this.moveTrainOnRailway(item));
  }

  moveTrainOnRailway(railway) {
    const isToMoveImediatly = this.checkCrossPlatform(railway);

    if (isToMoveImediatly.isToMove) {
      console.log(`Railway \'${railway.railway}\'. Moving ${railway.currentTrainStation} => ${railway.nextStation}. People number: ${railway.peopleNumber}`);
      railway.peopleNumber = this.returnNewPeopleNumber(railway);
      railway.currentTrainStation = railway.nextStation;
    } else {
      console.log(`Railway \'${railway.railway}\'. Need to move ${railway.currentTrainStation} => ${railway.nextStation}. Waiting for train \'${isToMoveImediatly.railwayName}\' to pass...People number: ${railway.peopleNumber}`);
    }
  }

  returnTrainNextStation(railway) {
    const { currentTrainStation, isTrainDirectionIncrementing, stationsCount } = railway;

    let nextStation = currentTrainStation;

    if (currentTrainStation === 1 && !isTrainDirectionIncrementing) {
      nextStation = 2;
      railway.isTrainDirectionIncrementing = true;
    } else if (currentTrainStation === stationsCount && isTrainDirectionIncrementing) {
      nextStation = currentTrainStation - 1;
      railway.isTrainDirectionIncrementing = false;
    } else {
      nextStation = isTrainDirectionIncrementing ? nextStation + 1 : nextStation - 1;
    }

    railway.nextStation = nextStation;
  }

  checkCrossPlatform(railway) {
    const { railwaysData: railways } = this;
    const crossedStation = railway.cross.find(item => item.stationNumber === railway.nextStation);

    if (crossedStation && Object.keys(crossedStation).length) {
      const crossedRailway = railways.find(item => item.railway === crossedStation.withRailway);
      const crossedRailwayWithCurrentRailwayStation = crossedRailway.cross.find(item => item.withRailway === railway.railway);
      if (crossedRailwayWithCurrentRailwayStation) {
        if (crossedRailwayWithCurrentRailwayStation.stationNumber === crossedRailway.nextStation) {
          return {
            isToMove: railway.peopleNumber > crossedRailway.peopleNumber,
            railwayName: crossedRailway.railway
          };
        }
      }
    }

    return {
      isToMove: true,
      railwayName: null
    };
  }

  returnNewPeopleNumber({ peopleNumber }) {
    const randomNumber = generateRandomNumber();
    const newPeopleNumber = peopleNumber + randomNumber;
    return newPeopleNumber > 0 ? newPeopleNumber : 0;
  }

  run() {
    const { iterationTime } = this;

    setInterval(() => {
      this.runIntervalIteration();
      console.log('===============================');
    }, iterationTime);
  }
}

// FOR testing objectA: peopleNumber:130, crossB: stationNumber: 4
const railwaysInitialData = [
  {
    railway: 'A',
    stationsCount: 7,
    currentTrainStation: 1,
    peopleNumber: 130,
    cross: [
      {
        withRailway: 'C',
        stationNumber: 3
      },
      {
        withRailway: 'B',
        stationNumber: 5
      }
    ],
    isTrainDirectionIncrementing: true // 1 => 2 => 3
  },
  {
    railway: 'B',
    stationsCount: 6,
    currentTrainStation: 1,
    peopleNumber: 90,
    cross: [
      {
        withRailway: 'C',
        stationNumber: 3
      },
      {
        withRailway: 'A',
        stationNumber: 4
      }
    ],
    isTrainDirectionIncrementing: true // 1 => 2 => 3
  },
  {
    railway: 'C',
    stationsCount: 6,
    currentTrainStation: 1,
    peopleNumber: 120,
    cross: [
      {
        withRailway: 'A',
        stationNumber: 3
      },
      {
        withRailway: 'B',
        stationNumber: 4
      }
    ],
    isTrainDirectionIncrementing: true // 1 => 2 => 3
  }
];

const railway = new Railway(railwaysInitialData);

railway.run();


