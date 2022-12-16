Comverse Storefront Deployment ------------------------------------------

npm run build
aws ecr get-login-password --region us-east-1 --profile ces | docker login --username AWS --password-stdin 570325721812.dkr.ecr.us-east-1.amazonaws.com
docker build -t staging-comvers-storefront .
docker tag staging-comvers-storefront:latest 570325721812.dkr.ecr.us-east-1.amazonaws.com/staging-comvers-storefront:latest
docker push 570325721812.dkr.ecr.us-east-1.amazonaws.com/staging-comvers-storefront:latest
aws ecs update-service --service staging-comverse-storefront --cluster ces-frontend-cluster --force-new-deployment --region us-east-1 --profile ces

Comverse Demo Storefront Deployment ------------------------------------------

npm run build
aws ecr get-login-password --region us-east-1 --profile ces | docker login --username AWS --password-stdin 570325721812.dkr.ecr.us-east-1.amazonaws.com
docker build -t comverseglobal-react-storefront .
docker tag comverseglobal-react-storefront:latest 570325721812.dkr.ecr.us-east-1.amazonaws.com/comverseglobal-react-storefront:latest
docker push 570325721812.dkr.ecr.us-east-1.amazonaws.com/comverseglobal-react-storefront:latest
aws ecs update-service --service comverseglobal-react-storefront --cluster ces-frontend-cluster --force-new-deployment --region us-east-1 --profile ces

Jo Chaho Storefront Deployment ------------------------------------------

npm run build
aws ecr get-login-password --region us-east-1 --profile ces | docker login --username AWS --password-stdin 570325721812.dkr.ecr.us-east-1.amazonaws.com
docker build -t jo-chaho-prod-storefront .
docker tag jo-chaho-prod-storefront:latest 570325721812.dkr.ecr.us-east-1.amazonaws.com/jo-chaho-prod-storefront:latest
docker push 570325721812.dkr.ecr.us-east-1.amazonaws.com/jo-chaho-prod-storefront:latest
aws ecs update-service --service jo-chaho-prod-storefront --cluster ces-frontend-cluster --force-new-deployment --region us-east-1 --profile ces