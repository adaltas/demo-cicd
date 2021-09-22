
pipeline {
    agent none
    stages {
        //stage('Test') {
        //    agent { docker { image 'node:14-alpine' } }
        //    steps {
        //        sh 'yarn test'
        //    }
        //}
        stage('Build') {
            agent { label 'builder' }
            steps {
                // Build new image
                sh "until docker ps; do sleep 3; done && docker build -t pacordonnier/pacordonnierdemocicd:${env.GIT_COMMIT} ."
                // Publish new image
                sh "docker push pacordonnier/pacordonnierdemocicd:${env.GIT_COMMIT}"
            }
        }

        stage('Deploy E2E') {
            agent { label 'builder' }
            steps {
                sh "rm -rf demo-cicd-ops"
                sh "git clone git@github.com:PACordonnier/demo-cicd-ops.git"
                
                dir("demo-cicd-ops") {
                    sh "cd ./dev && kustomize edit set image pacordonnier/pacordonnierdemocicd:${env.GIT_COMMIT}"
                    sh "git commit -am 'Publish new version' && git push || echo 'no changes'"
                }
            }
        }

        stage('Deploy to Prod') {
            agent { label 'builder' }
            input { message 'Approve deployment?' }
            steps {
                dir("demo-cicd-ops") {
                    sh "cd ./prod && kustomize edit set image pacordonnier/pacordonnierdemocicd:${env.GIT_COMMIT}"
                    sh "git commit -am 'Publish new version' && git push || echo 'no changes'"
                }
            }
        }
    }
}
