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
    console.log(`Railway \'${railway.railway}\'`);

    const isToMoveImediatly = this.checkCrossPlatform(railway);

    if (isToMoveImediatly) {
      console.log(`Moving ${railway.currentTrainStation} => ${railway.nextStation}.`);
      railway.currentTrainStation = railway.nextStation;
    } else {
      console.log(`Waiting for other train to pass...`);
    }
  }

  returnTrainNextStation(railway) {
    const { currentTrainStation, isTrainDirectionIncrementing, stationsCount } = railway;

    let nextStation = currentTrainStation;

    if (currentTrainStation === 0 && !isTrainDirectionIncrementing) {
      nextStation = 1;
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
          return railway.peopleNumber > crossedRailway.peopleNumber;
        }
      }
    }

    return true;
  }



  run() {
    const { iterationTime } = this;

    setInterval(() => {
      this.runIntervalIteration();
      console.log('===============================');
    }, iterationTime);
  }
}

const railwaysInitialData = [
  {
    railway: 'A',
    stationsCount: 7,
    currentTrainStation: 1,
    peopleNumber: 100,
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


