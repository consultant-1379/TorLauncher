/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2020
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/
package pipeline

node("Jenkins_fem33s11_mesos_podj") {

    timestamps {
        try {

            configurePipeline(
                    groupId: "com.ericsson.nms.pres",
                    artifactId: "TorLauncher"
            )
            checkoutPhase useConsolidatedDocker: false, gerritProject: env.GERRIT_PROJECT, checkoutMaster: true
            setupPhase isReleaseJob: true
            releasePhase(
                    releaseGoals: [ '-Dresume=false release:prepare release:perform -DpreparationGoals="clean" -Dgoals="clean deploy" -DlocalCheckout=true -Pui_publish']
            )

            qualityGatePhase checkQualityGate: false
            deliveryPhase(
                    disableDelivery: true, // We can enable this when we think is ok to have auto-delivery
                    disableQueue: true
            )


        } finally {
            completePipelinePhase(
                removeDockerContainers: false,
                collectDockerLogs: false,
                deleteWorkspace: true
            )
        }
    }
}
