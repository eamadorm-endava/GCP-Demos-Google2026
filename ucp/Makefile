PROJECT_ID=p-s-gcu-na-marketing-bd5y-1
REGION=us-west4
AR_NAME=gcp-demos
BACKEND_BASE_NAME=emma_ucp_backend
FRONTEND_BASE_NAME=emma_ucp_frontend
BACKEND_IMAGE_NAME=${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_NAME}/${BACKEND_BASE_NAME}:latest
FRONTEND_IMAGE_NAME=${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_NAME}/${FRONTEND_BASE_NAME}:latest


gcloud-auth:
	gcloud auth login

# Register docker with the Artifact Registry to allow pushing images
link-docker-ar:
	gcloud auth configure-docker ${REGION}-docker.pkg.dev

# UCP Backend service
build-backend-image:
	docker build -t ${BACKEND_IMAGE_NAME} -f business_agent/Dockerfile .

push-backend-image:
	docker push ${BACKEND_IMAGE_NAME}

deploy-backend:
	gcloud run deploy emma-ucp-backend \
		--project ${PROJECT_ID} \
		--image ${BACKEND_IMAGE_NAME} \
		--region ${REGION} \
		--platform managed \
		--allow-unauthenticated \
		--min-instances 1 \
		--port 10999 \
		--set-env-vars "GOOGLE_API_KEY=mock-api-key,API_BASE_URL=mock-backend-url"

build-deploy-backend:
	make build-backend-image
	make push-backend-image
	make deploy-backend

run-backend-container:
	docker run -p 10999:10999  business_agent

# UCP Frontend service
build-frontend-image:
	docker build -t ${FRONTEND_IMAGE_NAME} -f chat-client/Dockerfile .

push-frontend-image:
	docker push ${FRONTEND_IMAGE_NAME}

deploy-frontend:
	gcloud beta run deploy emma-ucp-frontend \
		--project ${PROJECT_ID} \
		--image ${FRONTEND_IMAGE_NAME} \
		--region ${REGION} \
		--platform managed \
		--allow-unauthenticated \
		--min-instances 1 \
		--port 8080 \
		--no-iap

build-deploy-frontend:
	make build-frontend-image
	make push-frontend-image
	make deploy-frontend
