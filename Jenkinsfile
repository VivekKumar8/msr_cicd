pipeline {
    agent any 

    stages {
		stage('Clean'){
            steps {
               cleanWs()
            }
        }
        stage('Initialize'){
            steps {
                sh 'chmod -R 777 ${WORKSPACE}'
            }
        }
		stage('Build'){
            steps {
		    script {
				if (params.WmCloudStreams == false) {
					echo "${WORKSPACE}/packages/wMPackages/WmCloudStreams"
					sh "rm -rf ${WORKSPACE}/packages/wMPackages/WmCloudStreams"
    			   }
		    	if (params.WmJDBCAdapter == false) {
					sh "rm -rf ${WORKSPACE}/packages/wMPackages/WmJDBCAdapter" 
    			   }
			   }
		    sh "${WORKSPACE}/Build.sh"
            }
        }
		stage('Deploy'){
            steps {
                sh '${WORKSPACE}/Deploy.sh'
            }
        }
    }
}
