import React from 'react'
import { useState } from 'react'
import Table from 'react-bootstrap/Table';
import { useParams } from "react-router-dom";

export default function Exercise({ title, description, createdAt, updatedAt, link, neededReps, neededDuration, poses }) {

    let params = useParams();
    console.log(params);
    const [expended, setExpended] = useState(false);

    function toggleExpender(e) {
        if (e.target.type === 'checkbox') return;

        setExpended(!expended);
    }

    return (
        <>
            <tr onClick={toggleExpender}>
                <td>{title}</td>
                <td>{description}</td>
                <td>{createdAt}</td>
                <td>{updatedAt}</td>
                <td>{link}</td>
                <td>{neededReps}</td>
                <td>{neededDuration}</td>
            </tr>
            {expended &&
                <div>
                    <h4>Poses</h4>
                    <Table>
                        <thead>
                            <tr>
                                <th>Label</th>
                                <th>First Edge Index</th>
                                <th>Second Edge Index</th>
                                <th>Desired Angle</th>
                                <th>Required Angle</th>
                                <th>Angle Threshold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {poses.map((pose, index) => {
                                return pose.requirements.map((requirement, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{requirement.bodyJoint.label}</td>
                                            <td>{requirement.bodyJoint.firstEdgeIndex}</td>
                                            <td>{requirement.bodyJoint.secondEdgeIndex}</td>
                                            <td>{requirement.bodyJoint.desiredAngle}</td>
                                            <td>{requirement.requiredAngle}</td>
                                            <td>{requirement.angleThreshold}</td>
                                        </tr>
                                    )
                                })
                            })}
                        </tbody>
                    </Table>
                </div>}
        </>
    )
}
