# Deployment

For deployment we use CloudFront and S3.
You can find the CloudFront distribution ID and S3 bucket in the AWS console.
Also you need a profile in your AWS credentials file to deploy the frontend with the right permissions.

## 1. Set the variables using `.env.template` to create `.env.<environment>` file.

- This variables are used to run the frontend app in the environment. Are used inside the app using `import.meta.env`

```bash
cp .env.template .env.staging
```

```bash
cp .env.template .env.development
```

```bash
cp .env.template .env.production
```

## 2. Create `.deploy.<environment>.env` file from `.deploy.template.env` and set the variables

- This variables are used to deploy the frontend to the environment. They are used in the deploy script to build the frontend and deploy it to the environment.

```bash
cp .deploy.template.env .deploy.staging.env
```

```bash
cp .deploy.template.env .deploy.development.env
```

```bash
cp .deploy.template.env .deploy.production.env
```

## 3. Use node version > 20

recommended:

```bash
nvm use 20.15.0
```

## 4. Deploy command

```bash
./scripts/deploy/deploy.sh staging
```

## Development

```bash
./scripts/deploy/deploy.sh development
```

## Production

```bash
./scripts/deploy/deploy.sh production
```
