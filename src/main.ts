import {edict} from "@edict/core";

console.log('Hello World!');

const WIDTH = 800
const HEIGHT = 600
const newDest = () => ({
  destX: Math.floor(Math.random() * WIDTH),
  destY: Math.floor(Math.random() * HEIGHT)
})
// Start an edict session
const { insert, rule, fire, retract } = edict<{
  speed: number;
  dt: number;
  destX: number;
  destY: number;
  x: number,
  y: number
}>();



// Enact the rules for this session
rule(
  'Circles with a destination move to destination',
  ({   speed , dt }) => ({
    $npc: {x: {then: false}, y: {then: false}, speed },
    time: { dt },
  })
).enact({
  then: ({ $npc: {x, y, id, speed}, time }) => {
    insert({
      [id]: {
        x: x + 0.1 * speed * time.dt,
        y: y + 0.1 * speed * time.dt
      }
    })
  },
});

rule(
  'when the values get to big reset',
  ({ x, y, dt }) => ({
    $npc: {
      x, y
      },
    time: { dt }
  })
).enact({
  then: ({ $npc }) => {
    if ($npc.x  > 100) {
      insert({
          [$npc.id]: newDest()
        }
      );
    }
  },
});


for(let i = 0; i < 500; i++) {
  insert({
    [`c${i}`]: {
      speed: Math.random() * 2,
      ...newDest(),
    }
  })
}

  // Continuously update the dt fact (delta time)
for(let i = 0; i < 1000; i++) {
  insert({
    time: { dt: 16 },
  });
  fire();
  console.log("fired")
}
