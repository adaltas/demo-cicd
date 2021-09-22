
pipeline {
    agent none
    stages {
        stage('Test') {
            agent { docker { image 'node:14-alpine' } }
            steps {
                sh 'yarn test'
            }
        }
        stage('Build') {
            agent { label 'builder' }
            environment {
                DOCKERHUB_CREDS = credentials('dockerhub')
            }
            steps {
                // Build new image
                sh "until docker ps; do sleep 3; done && docker build -t pacordonnier/pacordonnierdemocicd:${env.GIT_COMMIT} ."
                // Publish new image
                sh "docker push pacordonnier/pacordonnierdemocicd:${env.GIT_COMMIT}"
            }
        }

        stage('Deploy E2E') {
            agent { label 'builder' }
            environment {
                GIT_CREDS = credentials('git')
            }
            steps {
                sh "git clone git@github.com:PACordonnier/demo-cicd-ops.git"
                
                dir("argocd-demo-deploy") {
                    sh "cd ./dev && kustomize edit set image pacordonnier/pacordonnierdemocicd:${env.GIT_COMMIT}"
                    sh "git commit -am 'Publish new version' && git push || echo 'no changes'"
                }
            }
        }

        stage('Deploy to Prod') {
            steps {
                agent { label 'builder' }
                input message:'Approve deployment?'
                container('tools') {
                dir("argocd-demo-deploy") {
                    sh "cd ./prod && kustomize edit set image pacordonnier/pacordonnierdemocicd:${env.GIT_COMMIT}"
                    sh "git commit -am 'Publish new version' && git push || echo 'no changes'"
                }
                }
            }
        }
    }
}
