const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

async function getSecret() {
    const name = "projects/735973166375/secrets/dutchnsettle-app/versions/latest";
    try {
        const [version] = await client.accessSecretVersion({ name });
        const payload = version.payload.data.toString('utf8');

        return JSON.parse(payload);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getSecret }