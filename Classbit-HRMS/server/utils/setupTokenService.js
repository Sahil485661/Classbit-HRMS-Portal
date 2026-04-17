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
            console.log(`   Your ONE-TIME Setup Token is:`);
            console.log(`   ${this.token}`);
            console.log('   ');
            console.log('   Please provide this token in the UI to configure ');
            console.log('   the initial Super Admin account.');
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
