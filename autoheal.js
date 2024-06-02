/*
name: Heal
author: Nico
*/

import { breeze, Timer, mc, C09PacketHeldItemChange, playerController } from '../breeze_defs';

const timer = new Timer();

breeze.registerModule('heal', 'automaticly heal when you are low', {

    healed: false,
    delay: new DoubleSetting('Health', 'The point at which auto heal, kicks in', 1, 0.5, 20),
    slot: new DoubleSetting('Hotbar slot', 'Where in your hotbar the healing item will be', 1, 0, 10),
    bypass: new BooleanSetting('Bypass', 'If the module should use a watch dog bypassing method or not', false),

    tick: function(event) {
        player = mc.getPlayer()
        health = player.getHealth()

        if (health < this.delay.getValue()) {
            if (!this.healed) {
                breeze.postNotification('Auto heal', 'You reached your health thresh hold, now healing...')
                breeze.sendPacket(new C09PacketHeldItemChange(this.slot.getValue()-1), this.bypass.getValue())
                try {playerController.sendUseItem()} catch (err) {player.swingItem()}
                healed = true
                breeze.postNotification('Auto heal', 'Finished healing')
                timer.reset()
            } else if (timer.hasPassed(2*1000)) {
                this.healed = false
            }
        }
    }
})