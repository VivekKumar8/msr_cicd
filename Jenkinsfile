def WmCloudStreamsAnalyticsName = "xxxx"
def WmJDBCAdapterName = "xxxx"
pipeline {
    agent any 

    stages {
        stage('Initialize'){
            steps {
                sh 'chmod -R 777 ${WORKSPACE}'
            }
        }
		stage('Build'){
            steps {
		    echo " The environment is ${params.WmCloudStreamsAnalytics}"
		    script {
   			 if (params.WmCloudStreamsAnalytics == true) {
       			echo " The environment inside script is ${params.WmCloudStreamsAnalytics}"
				WmCloudStreamsAnalyticsName="Demo" 
    				}
		}
                //sh "${WORKSPACE}/Build.sh ${params.WmJDBCAdapter} ${params.WmCloudStreamsAnalytics}"
		    sh "${WORKSPACE}/Build.sh ${params.WmJDBCAdapter} ${WmCloudStreamsAnalyticsName}"
		//   sh "${WORKSPACE}/Build.sh ${params.WmJDBCAdapter} /packages/wMPackages/WmCloudStreamsAnalytics"
            }
        }
		stage('Deploy'){
            steps {
                sh '${WORKSPACE}/Deploy.sh'
            }
        }
    }
}
