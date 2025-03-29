import React, { useState } from "react";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random values in the range {min, max}
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Create an attack log
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer: isPlayer,
    isDamage: true,
    text: ` takes ${damage} damages`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: ` heal ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------
  const [monHealth, setMonHealth] = useState(100);
  const [yourHealth, setYourHealth] = useState(100);
  const [logs, updateLog] = useState([]);
  const [is3Turn, setIs3Turn] = useState(false);
  const [turn, setTurn] = useState(3);
  let isOver = monHealth <= 0 || yourHealth <= 0;
  let winnner;
  if (monHealth <= 0 && yourHealth > 0) {
    winnner = "Player has won !";
  } else if (monHealth <= 0 && yourHealth <= 0) {
    winnner = "Draw! No one win";
  } else {
    winnner = "Monster has won !";
  }
  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  // Handle Attack Button Clicking Event
  const handleAttackButton = () => {
    let damage = getRandomValue(5, 12);
    let newDamage = getRandomValue(5, 12);
    setYourHealth((prevHealth) => {
      if (prevHealth - damage <= 0) {
        return 0;
      } else {
        return prevHealth - damage;
      }
    });
    setMonHealth((prevHealth) => {
      if (prevHealth - newDamage <= 0) {
        return 0;
      } else {
        return prevHealth - newDamage;
      }
    });
    updateLog((prevLog) => [
      createLogAttack(true, damage),
      createLogAttack(false, newDamage),
      ...prevLog,
    ]);

    if (turn > 1) {
      setTurn((prev) => prev - 1);
      setIs3Turn(false);
    } else {
      setTurn(3);
      setIs3Turn(true);
    }
    console.log(turn);
  };

  // Handle Special Button Clicking Event
  const handleSpecialButton = () => {
    let damage = getRandomValue(5, 12);
    let newDamage = getRandomValue(8, 25);
    setMonHealth((prevHealth) => {
      if (prevHealth - newDamage <= 0) {
        return 0;
      } else {
        return prevHealth - newDamage;
      }
    });
    setYourHealth((prev) => {
      if (prev - damage <= 0) {
        return 0;
      } else {
        return prev - damage;
      }
    });
    updateLog((prevLog) => [
      createLogAttack(true, damage),
      createLogAttack(false, newDamage),
      ...prevLog,
    ]);
    setIs3Turn(false);
  };

  // Handle Healing Button Clicking Event
  const handleHealing = () => {
    let healAmount = getRandomValue(8, 15);
    setYourHealth((prev) => {
      if (prev + healAmount <= 100) {
        return prev + healAmount;
      } else {
        return 100;
      }
    });
    let damage = getRandomValue(5, 12);
    setYourHealth((prev) => prev - damage);
    updateLog((prev) => [
      createLogHeal(healAmount),
      createLogAttack(true, damage),
      ...prev,
    ]);
  };

  // Handle KILL YOUR SELF Event
  const handleKYS = () => {
    setYourHealth(0);
  };

  // Handle Start A New Game Clicking Event
  const handleRestart = () => {
    setMonHealth(100);
    setYourHealth(100);
    updateLog([]);
    setIs3Turn(false);
    setTurn(3);
  };
  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------
  // MAIN  TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return (
    <>
      <Entity entityName="Monster Health" entityHealth={monHealth} />
      <Entity entityName="Your Health" entityHealth={yourHealth} />
      {!isOver && (
        <section id="controls">
          <button onClick={handleAttackButton}>ATTACK</button>
          <button disabled={!is3Turn} onClick={handleSpecialButton}>
            SPECIAL !
          </button>
          <button onClick={handleHealing}>HEAL</button>
          <button onClick={handleKYS}>KILL YOURSELF</button>
        </section>
      )}
      {isOver && <GameOver title={winnner} restartGame={handleRestart} />}
      <Logs logMessages={logs} />
    </>
  );
}

function Entity({ entityHealth, entityName }) {
  return (
    <>
      <section className="container">
        <h2>{entityName}</h2>
        <div className="healthbar">
          <div
            style={{ width: `${entityHealth}%` }}
            className="healthbar__value"
          ></div>
        </div>
      </section>
    </>
  );
}

function GameOver({ title, restartGame }) {
  return (
    <>
      <section className="container">
        <h2>Game Over!</h2>
        <h3>{title}</h3>
        <button onClick={restartGame}>Start New Game</button>
      </section>
    </>
  );
}

function Logs({ logMessages }) {
  return (
    <>
      <section id="log" className="container">
        <h2>Battle Log</h2>
        <ul>
          {logMessages.map((log) => {
            return (
              <>
                <li>
                  <span
                    className={log.isPlayer ? "log--player" : "log--monster"}
                  >
                    {log.isPlayer ? "Player" : "Monster"}
                  </span>
                  {log.isDamage && (
                    <span className="log--damage">{log.text}</span>
                  )}
                  {!log.isDamage && (
                    <span className="log--heal">{log.text}</span>
                  )}
                </li>
              </>
            );
          })}
        </ul>
      </section>
    </>
  );
}
export default Game;
