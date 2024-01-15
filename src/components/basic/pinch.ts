import { interaction } from "pixi.js";
import { PinchData, PinchInfo, SceneContainer } from "../reveal/sceneContainer";

export default function pinchable(sprite: SceneContainer, inertia: boolean): void {

  function start(e: any): void {
    sprite.on('touchmove', move);
  }
  
  function move(e: any): void {
    sprite.debug.text = "move";

    let t = e.data.originalEvent.targetTouches;  //TouchEvent
    if (!t || t.length < 2) {
      sprite.debug.text += "\nno touch or less than 2 touches";
      return;
    }

    sprite.debug.text += "\n" + t.length + " touches";

    let dx = t[0].clientX - t[1].clientX;
    let dy = t[0].clientY - t[1].clientY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (!sprite._pinch) {
      sprite._pinch = new PinchInfo();
      sprite._pinch.p = new PinchData(distance, new Date());
      sprite.emit('pinchstart');
      return;
    }
    let now: Date = new Date();
    let interval = now.getTime() - sprite._pinch.p.date.getTime();
    if (interval < 12) {
      return;
    }
    let center = {
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2
    };
    let event = {
      scale: distance / sprite._pinch.p.distance,
      velocity: distance / interval,
      center: center,
      data: e.data
    };
    sprite.emit('pinchmove', event);
    sprite._pinch.pp = {
      distance: sprite._pinch.p.distance,
      date: sprite._pinch.p.date
    };
    sprite._pinch.p = {
      distance: distance,
      date: now
    };
  }

  function end(e: any): void {
    sprite.removeListener('touchmove', move);
    if (!sprite._pinch) {
      return;
    }
    if (inertia && sprite._pinch.pp) {
      if (sprite._pinch.intervalId) {
        return;
      }
      let interval = new Date().getTime() - sprite._pinch.p.date.getTime();
      let velocity = (sprite._pinch.p.distance - sprite._pinch.pp.distance) / interval;
      let center = sprite._pinch.p.center;
      let distance = sprite._pinch.p.distance;
      sprite._pinch.intervalId = setInterval(() => {
        if (Math.abs(velocity) < 0.04) {
          clearInterval(sprite._pinch.intervalId);
          sprite.emit('pinchend');
          sprite._pinch = null;
          return;
        }
        let updatedDistance = distance + velocity * 12;
        let event = {
          scale: updatedDistance / distance,
          velocity: velocity,
          center: center,
          data: e.data
        };
        sprite.emit('pinchmove', event);
        distance = updatedDistance;
        velocity *= 0.8;
      }, 12);
    } else {
      sprite.emit('pinchend');
      sprite._pinch = null;
    }
  }

  sprite.interactive = true;
  sprite.on('touchstart', start);
  sprite.on('touchend', end);
  sprite.on('touchendoutside', end);
}