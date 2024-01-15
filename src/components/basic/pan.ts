// export default function panable(sprite: any, inertia: boolean): void {
//   function mouseDown(e: MouseEvent): void {
//     start(e);
//   }
//   function touchStart(e: TouchEvent): void {
//     start(e.targetTouches[0]);
//   }
//   function start(t: MouseEvent | Touch): void {
//     if (sprite._pan) {
//       if (!sprite._pan.intervalId) {
//         return;
//       }
//       clearInterval(sprite._pan.intervalId);
//       sprite.emit('panend');
//     }
//     sprite._pan = {
//       p: {
//         x: t.clientX,
//         y: t.clientY,
//         date: new Date()
//       }
//     };
//     sprite
//       .on('mousemove', mouseMove)
//       .on('touchmove', touchMove);
//   }
//   function mouseMove(e: MouseEvent): void {
//     move(e, e);
//   }
//   function touchMove(e: TouchEvent): void {
//     let t = e.targetTouches;
//     if (!t || t.length > 1) {
//       end(e, t[0]);
//       return;
//     }
//     move(e, t[0]);
//   }
//   function move(e: MouseEvent | TouchEvent, t: MouseEvent | Touch): void {
//     let now = new Date();
//     let interval = now.getTime() - sprite._pan.p.date.getTime();
//     if (interval < 12) {
//       return;
//     }
//     let dx = t.clientX - sprite._pan.p.x;
//     let dy = t.clientY - sprite._pan.p.y;
//     let distance = Math.sqrt(dx * dx + dy * dy);
//     if (!sprite._pan.pp) {
//       let threshold = (t instanceof MouseEvent) ? 2 : 7;
//       if (distance > threshold) {
//         sprite.emit('panstart');
//       } else {
//         return;
//       }
//     } else {
//       let event = {
//         deltaX: dx,
//         deltaY: dy,
//         velocity: distance / interval,
//         data: e.data
//       };
//       sprite.emit('panmove', event);
//     }
//     sprite._pan.pp = {
//       x: sprite._pan.p.x,
//       y: sprite._pan.p.y,
//       date: sprite._pan.p.date
//     };
//     sprite._pan.p = {
//       x: t.clientX,
//       y: t.clientY,
//       date: now
//     };
//   }
//   function mouseUp(e: MouseEvent): void {
//     end(e, e);
//   }
//   function touchEnd(e: TouchEvent): void {
//     end(e, e.changedTouches[0]);
//   }
//   function end(e: MouseEvent | TouchEvent, t: MouseEvent | Touch): void {
//     sprite
//       .removeListener('mousemove', mouseMove)
//       .removeListener('touchmove', touchMove);
//     if (!sprite._pan || !sprite._pan.pp) {
//       sprite._pan = null;
//       return;
//     }
//     if (inertia) {
//       if (sprite._pan.intervalId) {
//         return;
//       }
//       let interval = new Date().getTime() - sprite._pan.pp.date.getTime();
//       let vx = (t.clientX - sprite._pan.pp.x) / interval;
//       let vy = (t.clientY - sprite._pan.pp.y) / interval;
//       sprite._pan.intervalId = setInterval(() => {
//         if (Math.abs(vx) < 0.04 && Math.abs(vy) < 0.04) {
//           clearInterval(sprite._pan.intervalId);
//           sprite.emit('panend');
//           sprite._pan = null;
//           return;
//         }
//         let touch = {
//           clientX: sprite._pan.p.x + vx * 12,
//           clientY: sprite._pan.p.y + vy * 12
//         };
//         move(e, touch);
//         vx *= 0.9;
//         vy *= 0.9;
//       }, 12);
//     } else {
//       sprite.emit('panend');
//       sprite._pan = null;
//     }
//   }
//   sprite.interactive = true;
//   sprite
//     .on('mousedown', mouseDown)
//     .on('touchstart', touchStart)
//     .on('mouseup', mouseUp)
//     .on('mouseupoutside', mouseUp)
//     .on('touchend', touchEnd)
//     .on('touchendoutside', touchEnd);
// }


