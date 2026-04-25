const crypto = require('crypto');

class SetupTokenService {
    constructor() {
        this.token = null;
    }

    generateToken() {
        if (!this.token) {
            this.token = crypto.randomUUID();
            console.log('\n======================================================');
            console.log('   SYSTEM SETUP REQUIRED - NO SUPER ADMIN FOUND       ');
            console.log('------------------------------------------------------');
            console.log('   A Setup Token has been generated in the background.');
            console.log('   Please request it via the UI to configure the');
            console.log('   initial Super Admin account.');
            console.log('======================================================\n');
        }
        return this.token;
    }

    validateToken(inputToken) {
        if (!this.token || !inputToken) return false;
        return this.token === inputToken;
    }

    invalidateToken() {
        this.token = null;
    }
}

module.exports = new SetupTokenService();
